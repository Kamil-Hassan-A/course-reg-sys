import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/Course";

// Enroll for a course (id = courseId)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId: number = parseInt(id);

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const coursesPath = path.join(process.cwd(), "data/courses.json");
    const coursesData = fs.readFileSync(coursesPath, "utf-8");
    const coursesFile = JSON.parse(coursesData);

    // Find the course
    const course = coursesFile.courses.find(
      (c: Course) => c.courseId === courseId
    );

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    if (course.enrolled) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    // Set enrolled to true
    course.enrolled = true;

    fs.writeFileSync(coursesPath, JSON.stringify(coursesFile, null, 2));

    return NextResponse.json({
      message: "Successfully enrolled!",
      course: course,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}

// Cancel a course registration (id = courseId)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const coursesPath = path.join(process.cwd(), "data/courses.json");
    const coursesData = fs.readFileSync(coursesPath, "utf-8");
    const coursesFile = JSON.parse(coursesData);

    // Find the course
    const course = coursesFile.courses.find(
      (c: Course) => c.courseId === courseId
    );

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Set enrolled to false
    course.enrolled = false;

    fs.writeFileSync(coursesPath, JSON.stringify(coursesFile, null, 2));

    return NextResponse.json({
      message: "Successfully unenrolled from course",
    });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    return NextResponse.json(
      { error: "Failed to unenroll from course" },
      { status: 500 }
    );
  }
}
