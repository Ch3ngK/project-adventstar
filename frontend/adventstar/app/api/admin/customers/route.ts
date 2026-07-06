import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 }
        );
    }

    const backendResponse = await fetch(apiUrl("/customers"), {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status
    });
}