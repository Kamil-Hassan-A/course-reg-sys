import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Course Registration System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse our catalog of courses and enroll in the ones you like!
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
          <Link href="/enrolled">
            <Button variant="outline">My Courses</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
