import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

type RouteContext = {
    params: Promise<{
        quoteId: string;
    }>;
};

export async function DELETE(request: Request, context: RouteContext) {
    const cookieStore = await cookies();
    const token = cookieStore.get("adventstar_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    const { quoteId } = await context.params;

    const backendResponse = await fetch(apiUrl(`/quotes/${quoteId}`), {
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