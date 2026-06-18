// /admin/page.tsx is a server component, and can only read cookies

import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

type LoginResponse = {
    access_token: string;
    token_type: string;
};

export async function POST(request: Request) {
    const body = await request.json(); 

    const backendResponse = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
        return NextResponse.json(
            { message: "Invalid email or password." },
            { status: 401 }
        );
    }

    const data: LoginResponse = await backendResponse.json();

    const response = NextResponse.json({ message: "Login successful. "})

    response.cookies.set("adventstar_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}