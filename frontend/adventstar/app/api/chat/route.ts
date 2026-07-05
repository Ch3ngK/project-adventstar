import OpenAI from "openai";
import { NextResponse } from "next/server";

type ChatRequest = {
    message: string;
};

function shouldShowEnquiryLink(message: string) {
    const normalizedMessage = message.toLowerCase();

    return (
        normalizedMessage.includes("quote") ||
        normalizedMessage.includes("price") ||
        normalizedMessage.includes("pricing") ||
        normalizedMessage.includes("cost") ||
        normalizedMessage.includes("how much") ||
        normalizedMessage.includes("order") ||
        normalizedMessage.includes("enquiry")
    );
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ChatRequest;

        if (!body.message || !body.message.trim()) {
            return NextResponse.json(
                { reply: "Please enter a message." },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    reply:
                        "The chatbot is not configured yet. Please add the OpenAI API key on the server.",
                },
                { status: 500 }
            );
        }

        const client = new OpenAI({ apiKey });

        const response = await client.responses.create({
            model: "gpt-5.5",
            instructions: `
                You are the Advent Star website assistant.

                Advent Star is a Singapore uniform supplier that provides uniforms and apparel
                for schools, corporate teams, hospitality groups, healthcare teams, industrial
                operations, and public sector organisations.

                You can help users understand:
                - uniform services
                - industries served
                - customization options
                - embroidery and printing
                - quotation requirements
                - general production considerations

                When a user is interested in a quote, guide them toward the enquiry form. 
                Ask them to prepare:
                - quantity
                - garment type
                - sizes
                - branding needs such as logo, embroidery, or printing
                - preferred timeline
                - contact details

                When answering: 
                - Be friendly, clear, and professional.
                - Keep replies short, usually 2 to 5 sentences.
                - Ask one useful follow-up question if the user is vague.
                - Guide serious buyers toward the enquiry form.

                Rules: 
                - Do not invent exact pricing.
                - Do not invent exact delivery timelines.
                - Do not promise stock availability.
                - Do not confirm order items.
                - If the user wants a quotation, tell them to submit an enquiry.
                - Keep answers short, clear, and professional.
                
                If the user asks for a quotation, explain that pricing depends on details such as quantity, garment type, sizes, materials, customization, and timeline. 
                Ask them to submit an enquiry with those details so the team can follow up properly. 
            `,
            input: body.message
        });

        const links = shouldShowEnquiryLink(body.message)
            ? [{ label: "Start Enquiry", href: "/enquiry" }]
            : undefined; 

        return NextResponse.json({
            reply: response.output_text,
            links, 
        });
    } catch {
        return NextResponse.json(
            {
                reply: 
                "Sorry, I'm having trouble right now. Please submit an enquiry instead or contact us directly via our contact details down below."
            },
            { status: 500 }
        );
    }
}
