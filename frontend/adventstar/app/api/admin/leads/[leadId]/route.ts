import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from  "@/lib/api";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { safeLimit } from "@/lib/rate-limit";

type RouteContext = {
    params: Promise<{
        leadId: string;
    }>
}

const draftRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60s"),
});

export async function GET(request: Request, context: RouteContext) {
    const cookiestore = await cookies()
    const token = cookiestore.get("adventstar_token")?.value; 

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { success } = await safeLimit(draftRatelimit, token);
    if (!success) {
        return NextResponse.json(
            { message: "Too many requests. Please wait a moment." },
            { status: 429 }
        );
    }

    const { leadId } = await context.params

    const backendResponse = await fetch(apiUrl(`/leads/${leadId}`), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status,
    })
}

export async function DELETE(request: Request, context: RouteContext) {
    const cookiestore = await cookies()
    const token = cookiestore.get("adventstar_token")?.value 

    if (!token) {
        return NextResponse.json(
            { message : "Not authenticated." },
            { status: 401 }
        );
    }

    const { leadId } = await context.params;
    const backendResponse = await fetch(apiUrl(`/leads/${leadId}`), {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (backendResponse.status === 204) {
        return new Response(null, { status: 204 });
    }

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status, 
    });
}   
