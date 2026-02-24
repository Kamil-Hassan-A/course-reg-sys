import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const dbPath = path.join(process.cwd(), "data/db.json");
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    if (username === db.admin.username && password === db.admin.password) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({
        success: true,
        message: "Login successful",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
