import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from  "@/lib/api";

type RouteContext = {
    params: Promise <{
        enquiryId: string;
    }>;
};

export async function PATCH(request: Request, context: RouteContext) {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("adventstar_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 }
        );
    }

    const { enquiryId } = await context.params;
    const body = await request.json();

    const backendResponse = await fetch(apiUrl(`/enquiries/${enquiryId}/status`), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status,
    })
}