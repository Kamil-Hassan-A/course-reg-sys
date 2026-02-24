import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { Course } from "@/types/Course";

// Generate thumbnail URL
function generateThumbnail(title: string): string {
  const colors = [
    { bg: "F7DF1E", text: "000000" }, // Yellow
    { bg: "61DAFB", text: "000000" }, // Cyan
    { bg: "3776AB", text: "FFFFFF" }, // Blue
    { bg: "E34F26", text: "FFFFFF" }, // Orange
    { bg: "339933", text: "FFFFFF" }, // Green
    { bg: "4479A1", text: "FFFFFF" }, // Light Blue
    { bg: "CC6699", text: "FFFFFF" }, // Pink
    { bg: "F1502F", text: "FFFFFF" }, // Red
    { bg: "563D7C", text: "FFFFFF" }, // Purple
    { bg: "00599C", text: "FFFFFF" }, // Dark Blue
  ];

  const colorIndex = title.length % colors.length;
  const color = colors[colorIndex];

  const words = title.split(" ").filter((word) => word.length > 2);
  const displayText = words.slice(0, 3).join("+");

  return `https://placehold.co/600x400/${color.bg}/${color.text}?text=${displayText}`;
}

// Get all available courses
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), "data/db.json");
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);
    return NextResponse.json(db.courses);
  } catch (error) {
    console.error("Error reading courses:", error);
    return NextResponse.json(
      { error: "Failed to load courses" },
      { status: 500 }
    );
  }
}

// Add new course (Admin auth required)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken");

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, instructor, description, level, duration } =
      await request.json();

    if (!title || !instructor || !description || !level || !duration) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), "data/db.json");
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    const newCourseId =
      Math.max(...db.courses.map((c: Course) => c.courseId)) + 1;

    const thumbnail = generateThumbnail(title);

    const newCourse = {
      courseId: newCourseId,
      title,
      instructor,
      description,
      level,
      duration,
      thumbnail,
      enrolled: false,
    };

    db.courses.push(newCourse);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({
      success: true,
      course: newCourse,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}
