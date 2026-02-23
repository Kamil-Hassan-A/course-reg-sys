import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/Course";
import { EnrolledCourse } from "@/types/EnrolledCourse";

// Get all enrolled courses
export async function GET() {
  try {
    const enrollmentsPath = path.join(process.cwd(), "data/enrollments.json");
    const enrollmentsData = fs.readFileSync(enrollmentsPath, "utf-8");
    const enrollments = JSON.parse(enrollmentsData);

    const coursesPath = path.join(process.cwd(), "data/courses.json");
    const coursesData = fs.readFileSync(coursesPath, "utf-8");
    const coursesFile = JSON.parse(coursesData);

    // Get full course details
    const enrolledCourses = enrollments.enrollments.map(
      (enrollment: EnrolledCourse) => {
        const course = coursesFile.courses.find(
          (c: Course) => c.courseId === enrollment.courseId
        );
        return {
          enrollmentId: enrollment.enrollmentId,
          courseId: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt,
          course: course,
        };
      }
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

// Enroll for a course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const enrollmentsPath = path.join(process.cwd(), "data/enrollments.json");
    const enrollmentsData = fs.readFileSync(enrollmentsPath, "utf-8");
    const enrollments = JSON.parse(enrollmentsData);

    // Check if already enrolled
    const alreadyEnrolled = enrollments.enrollments.some(
      (enrollment: EnrolledCourse) => enrollment.courseId === courseId
    );

    if (alreadyEnrolled) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    const newEnrollment = {
      enrollmentId: Date.now(),
      courseId: courseId,
      enrolledAt: new Date().toISOString(),
    };

    enrollments.enrollments.push(newEnrollment);

    fs.writeFileSync(enrollmentsPath, JSON.stringify(enrollments, null, 2));

    return NextResponse.json({
      message: "Successfully enrolled!",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}

// Cancel a course registration
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "Enrollment ID is required" },
        { status: 400 }
      );
    }

    const enrollmentsPath = path.join(process.cwd(), "data/enrollments.json");
    const enrollmentsData = fs.readFileSync(enrollmentsPath, "utf-8");
    const enrollments = JSON.parse(enrollmentsData);

    enrollments.enrollments = enrollments.enrollments.filter(
      (e: EnrolledCourse) => e.enrollmentId !== enrollmentId
    );

    fs.writeFileSync(enrollmentsPath, JSON.stringify(enrollments, null, 2));

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
