import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

type RouteContext = {
  params: Promise<{
    enquiryId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adventstar_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 }
    );
  }

  const { enquiryId } = await context.params;

  const backendResponse = await fetch(apiUrl(`/enquiries/${enquiryId}`), {
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