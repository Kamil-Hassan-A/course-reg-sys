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
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
