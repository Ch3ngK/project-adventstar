import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

type RouteContext = {
    params: Promise<{
        customerId: string;
    }>;
};

export async function GET(request: Request, context: RouteContext) {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("adventstar_token")?.value; 

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 }
        );
    }

    const { customerId } = await context.params;

    const backendResponse = await fetch(apiUrl(`/customers/${customerId}`), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }); 

    const data = await backendResponse.json();
    return NextResponse.json(data, {
        status: backendResponse.status, 
    });
}