export type Course = {
  courseId: number;
  title: string;
  instructor: string;
  description: string;
  level: string;
  duration: string;
  thumbnail: string;
  enrolled: boolean;
  category: string;
  rating: number;
  students: number;
  prerequisites: string[];
  syllabus: string[];
  language: string;
  certificate: boolean;
  lastUpdated: string;
};
