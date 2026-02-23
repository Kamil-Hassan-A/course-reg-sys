"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/Course";

interface ShadcnCardProps {
  course: Course;
  enrollmentId?: number;
  onActionComplete?: () => void;
  actionType?: "enroll" | "unenroll";
}

export function ShadcnCard({ 
  course, 
  enrollmentId,
  onActionComplete,
  actionType = "enroll" 
}: ShadcnCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course.courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully enrolled in course!");
        onActionComplete?.();
      } else {
        alert(data.error || "Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to enroll in course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm("Are you sure you want to unenroll from this course?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/enroll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enrollmentId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully unenrolled from course!");
        onActionComplete?.();
      } else {
        alert(data.error || "Failed to unenroll");
      }
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert("Failed to unenroll from course");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonConfig = {
    enroll: {
      onClick: handleEnroll,
      text: isLoading ? "Enrolling..." : "Enroll Now",
      variant: "default" as const,
    },
    unenroll: {
      onClick: handleUnenroll,
      text: isLoading ? "Cancelling..." : "Cancel Enrollment",
      variant: "destructive" as const,
    },
  };

  const config = buttonConfig[actionType];

  return (
    <Card className="flex flex-col">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full aspect-video object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>By {course.instructor}</CardDescription>
        <p className="text-sm mt-2">{course.description}</p>
        <div className="flex gap-2 mt-3">
          <Badge variant="secondary">{course.level}</Badge>
          <Badge variant="outline">{course.duration}</Badge>
        </div>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button
          onClick={config.onClick}
          disabled={isLoading}
          variant={config.variant}
          className="w-full"
        >
          {config.text}
        </Button>
      </CardFooter>
    </Card>
  );
}
