import { NextRequest, NextResponse } from "next/server";
import { setUserSession } from "@/lib/auth";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  email?: string;
  name?: string;
};

function decodeState(value: string | null) {
  if (!value) return "/booking";

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      redirect?: string;
    };
    return parsed.redirect?.startsWith("/") ? parsed.redirect : "/booking";
  } catch {
    return "/booking";
  }
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectPath = decodeState(request.nextUrl.searchParams.get("state"));
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${request.nextUrl.origin}/api/auth/google/callback`;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(redirectPath)}`, request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(redirectPath)}`, request.url));
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = (await userResponse.json()) as GoogleUserInfo;
  const sessionValue = user.email || user.name || "google-user";

  await setUserSession(sessionValue);

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
