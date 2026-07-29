import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { safeLimit } from "@/lib/rate-limit";

type RouteContext = {
    params: Promise<{
        sessionId: string;
    }>
}

const chatRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, "60s"),
});

export async function GET(request: Request, context: RouteContext) {
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 }
        );
    }

    const { sessionId } = await context.params;

    const backendResponse = await fetch(apiUrl(`/chat/sessions/${sessionId}/messages`), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status,
    });
}

export async function POST(request: Request, context: RouteContext) {
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 }
        );
    }

    const { success } = await safeLimit(chatRatelimit, token);
    if (!success) {
        return NextResponse.json(
            { message: "Too many messages. Please wait a moment." },
            { status: 429 }
        );
    }

    const { sessionId } = await context.params;
    const body = await request.json();

    const backendResponse = await fetch(apiUrl(`/chat/sessions/${sessionId}/messages`), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    let data: unknown;

    try {
        data = await backendResponse.json();
    } catch {
        data = { message: "Failed to get a reply. Please try again." };
    }

    return NextResponse.json(data, {
        status: backendResponse.status,
    });
}