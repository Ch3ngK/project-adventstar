
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { safeLimit } from "@/lib/rate-limit";

type RouteContext = {
    params: Promise<{
        messageId: string;
    }>
};

const sendRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60s"),
});

export async function PATCH(request: Request, context: RouteContext){
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { success } = await safeLimit(sendRatelimit, token);
    if (!success) {
        return NextResponse.json(
            { message: "Too many requests. Please wait a moment." },
            { status: 429 }
        );
    }

    const { messageId } = await context.params;
    const body = await request.json();

    const backendResponse = await fetch(apiUrl(`/messages/${messageId}`), {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    let data: unknown;

    try {
        data = await backendResponse.json();
    } catch {
        data = { message: "Failed to send message. Please try again." };
    }

    return NextResponse.json(data, {
        status: backendResponse.status,
    });
}