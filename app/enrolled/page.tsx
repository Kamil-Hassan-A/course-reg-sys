"use client";

import { useEffect, useState } from "react";
import { Course } from "@/types/Course";
import { ShadcnCourseCard } from "@/components/ShadcnCourseCard";

export default function EnrolledPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch("/api/enroll");
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  // Fetch enrolled courses when component loads
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
        <p className="text-muted-foreground">
          You haven&apos;t enrolled in any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <ShadcnCourseCard
            key={course.courseId}
            course={course}
            actionType="unenroll"
            onActionComplete={fetchEnrolledCourses}
          />
        ))}
      </div>
    </div>
  );
}
