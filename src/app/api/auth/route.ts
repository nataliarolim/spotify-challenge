import { NextResponse } from "next/server";
import crypto from "crypto";

// Generate a random code verifier
export const generateCodeVerifier = () => {
  return crypto.randomBytes(32).toString("base64url"); // This creates a base64url encoded string
};

// Generate the code challenge for PKCE
export const generateCodeChallenge = (codeVerifier: string) => {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
};

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const scope = "user-read-private user-read-email";
  console.log(
    process.env.SPOTIFY_REDIRECT_URI,
    "process.env.SPOTIFY_REDIRECT_URI"
  );

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  const searchParams = new URLSearchParams(params).toString();

  console.log(`${authUrl}?${searchParams}`, "urlTotal");

  return NextResponse.redirect(`${authUrl}?${searchParams}`, {
    headers: {
      "Set-Cookie": `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
