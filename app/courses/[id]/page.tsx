"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Course } from "@/types/Course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  Clock,
  Award,
  BookOpen,
  Globe,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}`);

        if (!response.ok) {
          throw new Error("Course not found");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError("Failed to load course details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      const response = await fetch(`/api/enroll/${course.courseId}`, {
        method: course.enrolled ? "DELETE" : "POST",
      });

      if (response.ok) {
        setCourse({ ...course, enrolled: !course.enrolled });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">{error || "Course not found"}</p>
        <Link href="/courses">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="mb-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant="outline">{course.category}</Badge>
                  {course.certificate && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Award className="mr-1 h-3 w-3" />
                      Certificate
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  Instructor: {course.instructor}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 text-lg">{course.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{course.language}</span>
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Prerequisites
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-gray-700">
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Syllabus */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Course Syllabus
                  </h3>
                  <div className="space-y-2">
                    {course.syllabus.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-semibold text-blue-600 min-w-[2rem]">
                          {index + 1}.
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* margin  */}
            <Card className="p-3">
              <CardHeader>
                <CardTitle>Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleEnroll}
                  className="w-full"
                  variant={course.enrolled ? "outline" : "default"}
                >
                  {course.enrolled ? "Unenroll" : "Enroll Now"}
                </Button>
                {course.enrolled && (
                  <Badge
                    variant="default"
                    className="w-full justify-center py-2"
                  >
                    ✓ Enrolled
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="p-3">
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course ID:</span>
                  <span className="font-semibold">#{course.courseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-semibold">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    Updated {new Date(course.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
