import { useState, useEffect } from "react";
import { TextInput, Textarea, Select } from "flowbite-react";
import { updateCourse } from "../../../libs/ApiResponseService";
import type { CourseRequest } from "../../../libs/models/Course";
import ThemedButton from "../../../components/ThemedButton";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

interface EditCourseFormProps {
  courseId: number;
  existingCourse?: CourseRequest;
  onSuccess?: () => void;
}

export default function EditCourseForm({
  courseId,
  existingCourse,
  onSuccess,
}: EditCourseFormProps) {
  const [editCourse, setEditCourse] = useState<CourseRequest>({
    courseName: "",
    courseDescription: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (existingCourse) {
      setEditCourse(existingCourse);
    }
  }, [existingCourse]);

  const handleChange = (field: keyof CourseRequest, value: string) => {
    setEditCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateCourse(courseId, editCourse);
      Swal.fire({
        icon: "success",
        title: "Course Update",
        text: "Course updated successfully",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      }).then(() => {
        onSuccess?.();
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Course Update Failed",
        text: "Failed to update the course",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800">Edit Course</h3>

      {/* Course Name */}
      <TextInput
        placeholder="Course Name"
        value={editCourse.courseName}
        onChange={(e) => handleChange("courseName", e.target.value)}
      />

      {/* Description */}
      <Textarea
        placeholder="Course Description"
        value={editCourse.courseDescription}
        onChange={(e) => handleChange("courseDescription", e.target.value)}
      />

      {/* Status */}
      <Select
        value={editCourse.status}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </Select>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <ThemedButton
          bgColor="#f3f4f6"
          textColor="#111827"
          onClick={onSuccess}
          size="sm"
          borderRadius="0.5rem"
        >
          Cancel
        </ThemedButton>
        <ThemedButton
          bgColor="var(--button-color)"
          textColor="#fff"
          onClick={handleSubmit}
          loading={loading}
          size="sm"
          borderRadius="0.5rem"
        >
          Update Course
        </ThemedButton>
      </div>
    </div>
  );
}
