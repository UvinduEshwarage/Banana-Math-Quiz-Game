import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

async function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function GET(request: Request) {
  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      return NextResponse.json(
        { message: "Google OAuth environment variables are not configured" },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "Missing authorization code" }, { status: 400 });
    }

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResp.ok) {
      const errorDetails = await tokenResp.text();
      return NextResponse.json({ message: "Failed to fetch Google token", details: errorDetails }, { status: 500 });
    }

    const tokenData = await tokenResp.json();
    const googleProfileResp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!googleProfileResp.ok) {
      const details = await googleProfileResp.text();
      return NextResponse.json({ message: "Failed to fetch Google profile", details }, { status: 500 });
    }

    const profile = await googleProfileResp.json();
    const email = profile.email;
    const name = profile.name || profile.given_name || "Google User";

    if (!email) {
      return NextResponse.json({ message: "Google account lacks email" }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ email });
    if (!user) {
      const randomPwd = Math.random().toString(36).slice(-12) + Date.now();
      const hashedPassword = await bcrypt.hash(randomPwd, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        authProvider: 'google'
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Check if this is a new user or existing user
    const isNewUser = user.authProvider === 'google' && (!user.password || user.password.length === 0);
    
    const response = isNewUser 
      ? NextResponse.redirect(new URL(`/set-password?email=${encodeURIComponent(user.email)}`, request.url))
      : NextResponse.redirect(new URL("/dashboard", request.url));
    
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
