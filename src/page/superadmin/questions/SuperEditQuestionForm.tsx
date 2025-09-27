import { useEffect, useState } from "react";
import { Textarea, Select, Label } from "flowbite-react";
import { updateQuestion as apiUpdateQuestion, getAllCourses } from "../../../libs/ApiResponseService";
import type { CourseResponse } from "../../../libs/models/Course";
import ThemedButton from "../../../components/ThemedButton";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

interface EditQuestionFormProps {
  questionId: number;
  initialCourseId: number | null;
  initialCategory: string;
  initialStatement: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = ["General Interest", "Career Interest", "Personal Qualities"];

export default function EditQuestionForm({
  questionId,
  initialCourseId,
  initialCategory,
  initialStatement,
  onSuccess,
  onCancel,
}: EditQuestionFormProps) {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(
    initialCourseId ? [String(initialCourseId)] : []
  );
  const [courseSearch, setCourseSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [statement, setStatement] = useState(initialStatement);
  const [loading, setLoading] = useState(false);

  // Fetch all active courses (no university filter)
  useEffect(() => {
    getAllCourses()
      .then(setCourses)
      .catch((err) => console.error("Failed to load courses", err));
  }, []);

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCourses.length === 0 || !category || !statement.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please select at least one course, category, and provide a statement",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);
    try {
      for (const courseId of selectedCourses) {
        await apiUpdateQuestion(questionId, {
          courseId: Number(courseId),
          category: category.toUpperCase().replace(" ", "_"),
          question: statement.trim(),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Update Question",
        text: "Question updated successfully",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      }).then(() => {
        onSuccess?.();
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Failed Update Question",
        text: "Failed to update the question",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search
  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Edit Question</h3>

      {/* Search + Checkboxes for courses */}
      <div>
        <Label>Search Course</Label>
        <input
          type="text"
          placeholder="Search courses..."
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
          className="w-full rounded-md border p-2 mb-2"
          disabled={loading}
        />

        <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <label
                key={course.courseId}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(String(course.courseId))}
                  onChange={() => toggleCourseSelection(String(course.courseId))}
                  disabled={loading}
                />
                <span>{course.courseName}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No courses found</p>
          )}
        </div>
      </div>

      <div>
        <Label>Category</Label>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Statement / Question</Label>
        <Textarea
          rows={6}
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Buttons using ThemedButton */}
      <div className="flex justify-end gap-3 pt-4">
        <ThemedButton
          bgColor="#f3f4f6"
          textColor="#111827"
          onClick={onCancel}
          size="sm"
          borderRadius="0.5rem"
          disabled={loading}
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
          Update Question
        </ThemedButton>
      </div>
    </div>
  );
}
