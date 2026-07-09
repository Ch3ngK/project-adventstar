from unittest.mock import patch
from app.schemas.quote_draft import QuoteDraft, QuoteDraftItem 

def make_enquiry(client):
    response = client.post("/enquiries", json={
        "customer_name": "Jane",
        "company_name": "Acme School",
        "email": "jane@acme.edu",
        "phone": None,
        "message": "Need 30 PE shirts, size M, by next month.",
    })
    return response.json()["id"]

def test_create_quote_draft_persists_and_returns_draft(client):
    enquiry_id = make_enquiry(client)

    fake_draft = QuoteDraft(
        items=[QuoteDraftItem(description="PE shirt", quantity=30)],
        suggested_notes="30 PE shirts, size M.",
        open_questions=["What branding method?"],
    )

    with patch("app.api.routes.enquiries.draft_quote", 
               return_value=fake_draft):
        response = client.post(f"/enquiries/{enquiry_id}/draft-quote")

        ## assert: Used to verify that a certain condition evaluates to true
        assert response.status_code == 200
        body = response.json()
        assert body["enquiry_id"] == enquiry_id
        assert body["items"][0]["description"] == "PE shirt" 
        assert body["open_questions"] == ["What branding method?"]

def test_get_quote_drafts_returns_generated_draft(client):
    enquiry_id = make_enquiry(client)
    fake_draft = QuoteDraft(items=[], suggested_notes="n/a", open_questions=[])

    with patch("app.api.routes.enquiries.draft_quote", return_value=fake_draft):
        client.post(f"/enquiries/{enquiry_id}/draft-quote")

    response = client.get(f"/enquiries/{enquiry_id}/draft-quote")

    assert response.status_code == 200
    assert len(response.json()) == 1