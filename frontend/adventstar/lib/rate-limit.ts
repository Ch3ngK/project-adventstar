import { Ratelimit } from "@upstash/ratelimit";

export async function safeLimit(
    limiter: Ratelimit,
    key: string,
): Promise<{ success: boolean }> {
    try {
        return await limiter.limit(key);
    } catch (err) {
        console.warn("[rate-limit] Redis unavailable, allowing request:", err);
        return { success: true };
    }
}
