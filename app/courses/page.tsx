"use client";

import { useEffect, useState } from "react";
import { Course } from "@/types/Course";
import { ShadcnCourseCard } from "@/components/ShadcnCourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch courses when component loads
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.level.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search courses by title, instructor, or level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <ShadcnCourseCard
              key={course.courseId}
              course={course}
              onActionComplete={fetchCourses}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? `No courses found matching "${searchQuery}"`
                : "No courses available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
