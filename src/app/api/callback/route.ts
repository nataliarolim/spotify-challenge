import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const codeVerifier = cookies.code_verifier;

  if (!code || !codeVerifier) {
    return NextResponse.json(
      { error: "Invalid code or code_verifier" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        code_verifier: codeVerifier,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
      }),
    });

    const responseData = await response.json();

    const { access_token } = responseData;

    if (!access_token) {
      return NextResponse.redirect("http://localhost:3000/"); // Use absolute URL
    }

    // Set access token in a cookie
    const res = NextResponse.redirect("http://localhost:3000/profile"); // Redirect to the profile page after login
    res.headers.append(
      "Set-Cookie",
      `access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    res.headers.append(
      "Set-Cookie",
      `access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    return res;
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 }
    );
  }
}
