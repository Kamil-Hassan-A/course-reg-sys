"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Course } from "@/types/Course";
import { ShadcnCourseForm } from "@/components/ShadcnCourseForm";
import { ShadcnCourseItem } from "@/components/ShadcnCourseList";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Still redirect even if API call fails
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      fetchCourses();
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="space-y-8">
          <ShadcnCourseForm onCourseAdded={fetchCourses} />

          <Card className="p-6">
            <h2 className="text-xl font-bold">
              Existing Courses ({courses.length})
            </h2>
            <div className="space-y-2">
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No courses added yet. Add your first course above!
                </p>
              ) : (
                courses.map((course) => (
                  <ShadcnCourseItem key={course.courseId} course={course} />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
