"use client";

import { useEffect, useState, useCallback } from "react";
import { Course } from "@/types/Course";
import { ShadcnCard } from "@/components/ShadcnCard";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Fetch courses when component loads
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <ShadcnCard 
            key={course.courseId} 
            course={course} 
            onActionComplete={fetchCourses} 
          />
        ))}
      </div>
    </div>
  );
}
