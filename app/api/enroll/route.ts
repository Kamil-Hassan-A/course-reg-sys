import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/Course";

// Get all enrolled courses
export async function GET() {
  try {
    const coursesPath = path.join(process.cwd(), "data/db.json");
    const coursesData = fs.readFileSync(coursesPath, "utf-8");
    const coursesFile = JSON.parse(coursesData);

    // Filter only enrolled courses
    const enrolledCourses = coursesFile.courses.filter(
      (course: Course) => course.enrolled === true
    );

    return NextResponse.json(enrolledCourses);
  } catch (error) {
    console.error("Error reading enrolled courses:", error);
    return NextResponse.json(
      { error: "Failed to load enrolled courses" },
      { status: 500 }
    );
  }
}
