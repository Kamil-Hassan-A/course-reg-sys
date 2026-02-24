"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ShadcnCourseFormProps {
  onCourseAdded?: () => void;
}

export function ShadcnCourseForm({ onCourseAdded }: ShadcnCourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    level: "Beginner",
    duration: "",
    category: "",
    rating: "4.5",
    students: "1000",
    prerequisites: "",
    syllabus: "",
    language: "English",
    certificate: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, level: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken");
      
      const courseData = {
        ...formData,
        rating: parseFloat(formData.rating),
        students: parseInt(formData.students),
        prerequisites: formData.prerequisites
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        syllabus: formData.syllabus
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        lastUpdated: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      };

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Course added successfully!");
        setFormData({
          title: "",
          instructor: "",
          description: "",
          level: "Beginner",
          duration: "",
          category: "",
          rating: "4.5",
          students: "1000",
          prerequisites: "",
          syllabus: "",
          language: "English",
          certificate: true,
        });
        onCourseAdded?.();
      } else {
        setError(data.error || "Failed to add course");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: "",
      instructor: "",
      description: "",
      level: "Beginner",
      duration: "",
      category: "",
      rating: "4.5",
      students: "1000",
      prerequisites: "",
      syllabus: "",
      language: "English",
      certificate: true,
    });
    setError("");
    setSuccess("");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold">Add New Course</h2>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Course Information</FieldLegend>
            <FieldDescription>
              Fill in the details to add a new course to the system
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Course Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Complete JavaScript Course"
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="instructor">Instructor</FieldLabel>
                <Input
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g., John Smith"
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what students will learn..."
                  className="resize-none"
                  rows={3}
                  required
                  disabled={loading}
                />
                <FieldDescription>
                  Provide a brief overview of the course content
                </FieldDescription>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="level">Level</FieldLabel>
                  <Select
                    value={formData.level}
                    onValueChange={handleSelectChange}
                    disabled={loading}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="duration">Duration</FieldLabel>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 24 hours"
                    required
                    disabled={loading}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Web Development"
                    required
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="language">Language</FieldLabel>
                  <Input
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    placeholder="e.g., English"
                    required
                    disabled={loading}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="rating">Rating (1-5)</FieldLabel>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="students">Number of Students</FieldLabel>
                  <Input
                    id="students"
                    name="students"
                    type="number"
                    min="0"
                    value={formData.students}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="prerequisites">Prerequisites</FieldLabel>
                <Textarea
                  id="prerequisites"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleInputChange}
                  placeholder="Enter prerequisites separated by commas"
                  className="resize-none"
                  rows={2}
                  required
                  disabled={loading}
                />
                <FieldDescription>
                  Separate each prerequisite with a comma
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="syllabus">Syllabus Topics</FieldLabel>
                <Textarea
                  id="syllabus"
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  placeholder="Enter syllabus topics separated by commas"
                  className="resize-none"
                  rows={3}
                  required
                  disabled={loading}
                />
                <FieldDescription>
                  Separate each topic with a comma
                </FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="certificate"
                    name="certificate"
                    checked={formData.certificate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        certificate: e.target.checked,
                      }))
                    }
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <FieldLabel htmlFor="certificate" className="mb-0">
                    Provides Certificate upon Completion
                  </FieldLabel>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldDescription className="text-xs text-muted-foreground">
            Note: Thumbnail will be automatically generated based on the course
            title
          </FieldDescription>

          {error && (
            <div className="bg-red-50 text-red-800 px-4 py-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md text-sm border border-green-200">
              {success}
            </div>
          )}

          <Field orientation="horizontal">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding Course..." : "Add Course"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleClearForm}
              disabled={loading}
            >
              Clear Form
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Card>
  );
}
