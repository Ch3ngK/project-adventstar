# Building the email-drafting AI agent — a guide, not an implementation

You're building this one yourself — this doc is the walkthrough we talked through, written down so you can pick it up tomorrow. It explains the architecture to follow and the two real decisions you need to make before wiring things up. It is *not* a diff to paste in; `app/schemas/email_draft.py` is already started as a stub for you to fill in.

## The two use cases you want

1. **Reply to an inbound enquiry** — a customer already messaged you; draft a response.
2. **Initial outreach** — no one messaged you; draft a cold introduction to a prospect.

These look similar (both produce an email) but have different inputs, different prompts, and one of them has a real legal wrinkle. Treat them as two functions sharing one architecture, not one function with a flag.

---

## The shared pattern: how `quote_agent.py` already does this

Every AI-assist feature in this codebase follows the same five layers. Your email agent should copy this shape exactly — it's proven, and it keeps every AI feature consistent for anyone reading the code later.

| Layer | Existing example (quote drafting) | What it does |
|---|---|---|
| **Service** | `backend/app/services/quote_agent.py` | Plain function: takes a DB object → builds a prompt → calls `client.responses.parse(model=..., instructions=..., input=..., text_format=<Schema>)` → returns parsed result. Raises a custom exception on failure. |
| **Schema** | `backend/app/schemas/quote_draft.py` | Pydantic shape the AI must return (`QuoteDraft`: `items`, `suggested_notes`, `open_questions`) plus a `*Response` variant with `id`/`created_at`/`from_attributes=True` for serializing DB rows. |
| **Model** | `backend/app/models/quote_draft.py` | SQLAlchemy table (`quote_drafts`) that persists every generated draft, so staff can revisit history instead of losing it on refresh. |
| **Route** | `backend/app/api/routes/enquiries.py` — `POST/GET .../draft-quote` | `POST` generates + persists a new draft (rate-limited `5/minute`, requires `get_current_user`). `GET` lists history for that enquiry, newest first. |
| **Proxy + UI** | `frontend/adventstar/app/api/admin/enquiries/[enquiryId]/draft-quote/route.ts` + the "Generate Quote Draft" / "View Drafts" buttons in `app/admin/(dashboard)/enquiries/page.tsx` | Next.js route forwards the request with the `adventstar_token` cookie as a Bearer header, and applies its own Upstash rate limit. The page keeps a `draftsByEnquiryId` cache in state and only re-fetches history if it's not already cached. |

Build `backend/app/services/email_agent.py` as a **new sibling file**, not an addition to `quote_agent.py`. Same shape, different prompts.

---

## Variant 1: Reply-to-enquiry — nearly a copy-paste of the existing pattern

You already have everything the agent needs on the `Enquiry` model: `message`, `customer_name`, `company_name`, `email`. This is structurally identical to `draft_quote(enquiry)`.

Suggested schema (this is the file you already have open — `app/schemas/email_draft.py`):

```python
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class EmailDraft(BaseModel):
    subject: str
    body: str

class EmailDraftResponse(EmailDraft):
    model_config = ConfigDict(from_attributes=True)
    id: int
    enquiry_id: int | None   # nullable — outreach drafts won't have one, see Variant 2
    created_at: datetime
```

Prompt guidance for the `instructions` string (same discipline as the quote agent):
- Warm, professional tone, written as Advent Star staff replying to a specific customer.
- Address what they actually asked — don't paraphrase generically.
- **Never invent** prices, timelines, or commitments that haven't been confirmed internally. If the enquiry is missing info needed to give a real answer, the draft should ask for it rather than guess (same `open_questions` instinct as the quote agent, could even reuse that field name).
- Sign off in a way that matches how the business actually signs emails (worth asking whoever handles this now).

Wiring: `POST/GET /enquiries/{id}/draft-email` on the backend, a matching Next.js proxy route, and a "Draft Reply" button next to "Generate Quote Draft" on the enquiries page, reusing the exact `handleGenerateDraft`/`draftsByEnquiryId` state pattern you already have.

---

## Variant 2: Cold outreach — this is where it genuinely diverges

Outreach has no enquiry to read — there's no message to respond to. Two decisions you need to make before you can build this:

### Decision 1: who does it email, and where does that data live?

Right now there's no "prospect" concept anywhere in the schema. `Customer` (`backend/app/models/customer.py`) is created manually by staff via `POST /customers` — nothing automatically populates it, and nothing distinguishes "someone we've done business with" from "someone we're trying to reach."

- **Option A — reuse `Customer` loosely.** Staff manually add a `Customer` row for a prospect company before any enquiry/order exists, then generate an outreach draft against it. Zero schema changes, fastest to ship. Downside: blurs what "Customer" means — the table now holds people who've never actually bought anything.
- **Option B — add a separate `Lead`/`Prospect` model.** Cleaner long-term (a real pipeline: Lead → enquiry/conversion → Customer), but real scope: new model + schema + routes + an admin UI page (a "Leads" list, similar to the existing Customers page) + a migration.

My lean: Option B is the "correct" shape if you expect to do outreach regularly, but Option A is a completely reasonable way to ship a first version and upgrade later. Your call — this is the biggest fork in the whole feature.

### Decision 2: draft-only, or actually send?

There is currently **zero email-sending infrastructure** in this codebase — no SMTP, no SendGrid/Resend/Postmark, no email-related env vars at all. "Actually send" means picking a provider, storing new API keys, and building a real send pipeline. That's a substantially bigger project than drafting.

There's also a compliance angle specific to outreach: unsolicited commercial email in Singapore falls under the **Spam Control Act** — it requires things like accurate sender identification and a working unsubscribe mechanism. That doesn't block you from *drafting* outreach emails with AI, but it's a real constraint you'd need to satisfy before any auto-send goes live, so it's worth knowing about now rather than discovering it later. (Reply-to-enquiry emails aren't unsolicited — the customer messaged you first — so this concern is specific to Variant 2.)

**My recommendation for both variants: draft-only**, same as the quote agent. Staff review the generated subject/body in the admin UI and either copy it into their own email client, or you add a `mailto:` link prefilled with the subject/body as a small convenience (mailto: links have a practical length limit, but it's generous enough for a normal email). This keeps the feature genuinely useful without taking on a send pipeline or the compliance work until you actually want it.

---

## Suggested build order

1. Resolve Decision 1 and Decision 2 above — everything downstream depends on them.
2. Fill in `app/schemas/email_draft.py` (shape sketched above; extend if you decide to store outreach-specific fields like `lead_id`/`customer_id`).
3. Add `backend/app/models/email_draft.py` — a single `email_drafts` table can likely serve both variants if you add a `kind: str` column (`"reply"` vs `"outreach"`) alongside the nullable `enquiry_id`.
4. Write `backend/app/services/email_agent.py` with two functions: `draft_enquiry_reply(enquiry)` and `draft_outreach_email(<prospect data, per Decision 1>)`, each with its own `instructions` prompt.
5. Add routes in `backend/app/api/routes/enquiries.py` (reply variant) and wherever your Decision-1 data lives (outreach variant) — mirror the rate-limiting and auth pattern from `draft-quote`.
6. Add matching Next.js proxy routes and UI buttons/panels, reusing the `draftsByEnquiryId`-style caching pattern.

## Open questions to bring back tomorrow

- [ ] Option A or B for outreach data (reuse `Customer`, or new `Lead` model)?
- [ ] Confirm draft-only is fine for v1 (recommended), or do you want to scope sending too?
- [ ] What should the actual email sign-off / sender identity look like?
