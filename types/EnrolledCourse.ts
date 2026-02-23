import { Course } from "./Course";

export type EnrolledCourse = {
  enrollmentId: number;
  courseId: number;
  enrolledAt: string;
  course: Course;
};
