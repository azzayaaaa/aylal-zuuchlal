import { NextRequest, NextResponse } from "next/server";

function getRedirectUri(request: NextRequest) {
  return process.env.GOOGLE_REDIRECT_URI ?? `${request.nextUrl.origin}/api/auth/google/callback`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID is not configured." },
      { status: 500 },
    );
  }

  const redirect = request.nextUrl.searchParams.get("redirect") || "/booking";
  const state = Buffer.from(JSON.stringify({ redirect })).toString("base64url");
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", getRedirectUri(request));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl);
}
