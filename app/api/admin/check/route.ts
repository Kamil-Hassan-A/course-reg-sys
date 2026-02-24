import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Check if admin
export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken");

    if (!adminToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const token = adminToken.value;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username, timestamp] = decoded.split(":");

    if (!username || !timestamp || isNaN(Number(timestamp))) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
