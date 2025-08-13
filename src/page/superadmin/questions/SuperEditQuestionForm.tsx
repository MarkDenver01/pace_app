import { useEffect, useState } from "react";
import { Textarea, Select, Label } from "flowbite-react";
import {
  updateQuestion as apiUpdateQuestion,
  getActiveCoursesByUniversity,
  getUniversities,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { CourseResponse } from "../../../libs/models/Course";
import ThemedButton from "../../../components/ThemedButton";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

interface EditQuestionFormProps {
  questionId: number;
  initialUniversityId: number | null;
  initialCourseId: number | null;
  initialCategory: string;
  initialStatement: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = ["General Interest", "Career Interest", "Personal Qualities"];

export default function EditQuestionForm({
  questionId,
  initialUniversityId,
  initialCourseId,
  initialCategory,
  initialStatement,
  onSuccess,
  onCancel,
}: EditQuestionFormProps) {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">(initialUniversityId ?? "");
  const [selectedCourse, setSelectedCourse] = useState<number | "">(initialCourseId ?? "");
  const [courseDescription, setCourseDescription] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [statement, setStatement] = useState(initialStatement);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUniversities().then(setUniversities).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      getActiveCoursesByUniversity(Number(selectedUniversity))
        .then(setCourses)
        .catch(console.error);
    } else {
      setCourses([]);
      setSelectedCourse("");
      setCourseDescription("");
    }
  }, [selectedUniversity]);

  useEffect(() => {
    if (selectedCourse) {
      const c = courses.find((course) => course.courseId === Number(selectedCourse));
      setCourseDescription(c?.courseDescription ?? "");
    } else {
      setCourseDescription("");
    }
  }, [selectedCourse, courses]);

  const handleSubmit = async () => {
    if (!selectedUniversity || !selectedCourse || !category || !statement.trim()) {
         Swal.fire({
                        icon: "warning",
                        title: "Incomplete Form",
                        text: "Please fill all fields",
                        confirmButtonText: "CLOSE",
                        ...getSwalTheme(),
                      })
      return;
    }

    setLoading(true);
    try {
      await apiUpdateQuestion(questionId, {
        courseId: Number(selectedCourse),
        category: category.toUpperCase().replace(" ", "_"),
        question: statement.trim(),
      });
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

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Edit Question</h3>

      <div>
        <Label>University</Label>
        <Select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(Number(e.target.value))}
          disabled={loading}
        >
          <option value="">Select a university</option>
          {universities.map((u) => (
            <option key={u.universityId} value={u.universityId}>
              {u.universityName}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Course</Label>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
          disabled={!selectedUniversity || loading}
        >
          <option value="">Select a course</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Course Description</Label>
        <Textarea rows={3} value={courseDescription} disabled />
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
