import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  if (!code) {
    throw new Error("Missing code parameter");
  }

  try {
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string, // Replace with your client ID
        client_secret: process.env.TWITCH_CLIENT_SECRET as string, // Replace with your client secret
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI as string, // Replace with your redirect URI
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Token exchange response:", data);
    // Respond with the access token data
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return new Response("Token exchange error", {
      status: 500,
    });
  }
}
