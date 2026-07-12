import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from  "@/lib/api";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { safeLimit } from "@/lib/rate-limit";

type RouteContext = {
    params: Promise<{
        enquiryId: string;
    }> 
}

const draftRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60s"),
});

export async function GET(request: Request, context: RouteContext) {
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated" },
            { status: 401 }
        )
    };

    const { success } = await safeLimit(draftRatelimit, token);
    if (!success) {
        return NextResponse.json(
            { message: "Too many requests. Please wait a moment."},
            { status: 429 }
        );
    }

    const { enquiryId } = await context.params;

    const backendResponse = await fetch(apiUrl(`/enquiries/${enquiryId}/draft-quote`), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status,
    })
}

export async function POST(request: Request, context: RouteContext) {
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value; 

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { success } = await safeLimit(draftRatelimit, token);
    if (!success) {
        return NextResponse.json(
            { message: "Too many draft requests. Please wait a moment." },
            { status: 429 }
        );
    }
    
    const { enquiryId } = await context.params;

    const backendResponse = await fetch(apiUrl(`/enquiries/${enquiryId}/draft-quote`), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`, 
        }, 
    });

    let data: unknown; 

    try {
        data = await backendResponse.json();
    } catch {
        data = { message: "Draft generation failed. Please try again."}; 
    }

    return NextResponse.json(data, {
        status: backendResponse.status, 
    });
}