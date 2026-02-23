import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Get all available courses
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data/courses.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileData);
    return NextResponse.json(data.courses);
  } catch (error) {
    console.error("Error reading courses:", error);
    return NextResponse.json(
      { error: "Failed to load courses" },
      { status: 500 }
    );
  }
}
