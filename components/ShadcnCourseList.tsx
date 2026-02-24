"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/Course";

interface ShadcnCourseItemProps {
  course: Course;
}

export function ShadcnCourseItem({ course }: ShadcnCourseItemProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{course.title}</ItemTitle>
        <ItemDescription>
          <span className="font-medium">{course.instructor}</span> •{" "}
          {course.duration} • {course.level}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant={course.enrolled ? "default" : "secondary"}>
          {course.enrolled ? "Enrolled" : "Available"}
        </Badge>
        <Badge variant="outline" className="text-xs">
          ID: {course.courseId}
        </Badge>
      </ItemActions>
    </Item>
  );
}
