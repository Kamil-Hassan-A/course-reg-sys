import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/Course";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), "data", "db.json");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    const course = dbData.courses.find((c: Course) => c.courseId === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
