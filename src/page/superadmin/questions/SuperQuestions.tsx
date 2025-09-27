import { useEffect, useState } from "react";
import { TabletsIcon } from "lucide-react";
import {
  Button,
  Label,
  Pagination,
  Select,
  Textarea,
  Modal,
} from "flowbite-react";
import {
  getActiveCourses,
  saveQuestion as apiSaveQuestion,
  getAllQuestions,
  deleteQuestion as apiDeleteQuestion,
} from "../../../libs/ApiResponseService";
import type { CourseResponse } from "../../../libs/models/Course";
import EditQuestionForm from "./SuperEditQuestionForm";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

type QuestionTableEntry = {
  id: number;
  course: string;
  courseDescription: string;
  content: string;
  category: string;
};

const categorized = ["General Interest", "Career Interest", "Personal Qualities"];

export default function StatementQuestionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statement, setStatement] = useState("");
  const [tableData, setTableData] = useState<QuestionTableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionTableEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const pageSize = 5;
  const totalPages = Math.ceil(tableData.length / pageSize);
  const paginatedData = tableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Load all courses once
  useEffect(() => {
    getActiveCourses()
      .then(setCourses)
      .catch((err) => console.error(err));
  }, []);

  // Load all questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  function loadQuestions() {
    setLoading(true);
    setError("");
    getAllQuestions()
      .then((questions) => {
        const mapped = questions.map((q: any) => ({
          id: q.questionId,
          course: q.courseName,
          courseDescription: q.courseDescription || "-",
          content: q.question,
          category: q.category,
        }));
        setTableData(mapped);
      })
      .catch((err) => {
        setError("Failed to load questions");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this question?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      ...getSwalTheme(),
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");
    try {
      await apiDeleteQuestion(id);
      await Swal.fire({
        icon: "success",
        title: "Delete Question",
        text: "Question deleted successfully",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });

      if (editingQuestion?.id === id) setEditingQuestion(null);
      loadQuestions();
    } catch (e) {
      setError("Failed to delete question");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (selectedCourses.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Course Selected",
        text: "Please select at least one course",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }
    if (!selectedCategory) {
      Swal.fire({
        icon: "warning",
        title: "No category Selected",
        text: "Please select a category",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }
    if (!statement.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Statement / Question Required",
        text: "Please enter a statement or question",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);
    setError("");

    const payloads = selectedCourses.map((courseId) => ({
      courseId: Number(courseId),
      category: selectedCategory.toUpperCase().replace(" ", "_"),
      question: statement.trim(),
    }));

    try {
      for (const data of payloads) {
        await apiSaveQuestion(data);
      }
      Swal.fire({
        icon: "success",
        title: "Save Question",
        text: "Question(s) saved successfully",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      }).then(() => {
        resetForm();
        loadQuestions();
      });
    } catch (e) {
      setError("Failed to save question");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSelectedCourses([]);
    setSelectedCategory("");
    setStatement("");
    setCourseSearch("");
  }

  function openEditModal(entry: QuestionTableEntry) {
    setEditingQuestion(entry);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setEditingQuestion(null);
    setIsEditModalOpen(false);
  }

  function onEditSuccess() {
    closeEditModal();
    loadQuestions();
  }

  const cardClass =
    "flex flex-col justify-between gap-4 p-6 rounded-2xl shadow-md card-theme border border-orange-600";
  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };
  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };

  // Filter courses by search
  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold" style={valueStyle}>
        Statements & Questions
      </h2>

      {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}

      {/* Add New Question Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
            Course Related
          </h3>

          {/* Search + Checkboxes */}
          <div>
            <Label htmlFor="courseSearch" style={valueStyle}>
              Search Course
            </Label>
            <input
              type="text"
              id="courseSearch"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className="w-full rounded-md border p-2 mb-2"
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
                      checked={selectedCourses.includes(
                        String(course.courseId)
                      )}
                      onChange={() =>
                        setSelectedCourses((prev) =>
                          prev.includes(String(course.courseId))
                            ? prev.filter(
                                (id) => id !== String(course.courseId)
                              )
                            : [...prev, String(course.courseId)]
                        )
                      }
                    />
                    <span>{course.courseName}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No courses found</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleSave}
              style={{
                backgroundColor: "var(--button-color)",
                color: "#fff",
                fontWeight: 600,
                padding: "0.5rem 2rem",
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Right Card */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
            Statement / Questions
          </h3>

          <div>
            <Label htmlFor="category" style={valueStyle}>
              Category
            </Label>
            <Select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categorized.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="statement" style={valueStyle}>
              Enter Statement / Questions
            </Label>
            <Textarea
              id="statement"
              placeholder="Enter Statement / Questions..."
              rows={6}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-t"
        style={{ borderColor: "var(--divider-color)" }}
      />

      {/* Table Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full" style={iconWrapperStyle}>
          <TabletsIcon size={20} />
        </div>
        <h3 className="text-lg font-semibold" style={labelStyle}>
          Statement & Questions List
        </h3>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow border border-orange-600 mt-3">
          <table className="min-w-full text-sm text-left" style={valueStyle}>
            <thead
              style={{ backgroundColor: "var(--button-color)", color: "#fff" }}
            >
              <tr>
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Course</th>
                <th className="p-3 font-medium">Course Description</th>
                <th className="p-3 font-medium">Statement / Question</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--card-color)" }}>
              {paginatedData.length > 0 ? (
                paginatedData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#FFEFEA] dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3">{entry.id}</td>
                    <td className="p-3">{entry.course}</td>
                    <td className="p-3">{entry.courseDescription}</td>
                    <td className="p-3">{entry.content}</td>
                    <td className="p-3">{entry.category}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(entry)}
                          className="px-4 py-1 text-xs font-medium rounded text-white bg-green-600 hover:brightness-110"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="px-4 py-1 text-xs font-medium rounded text-white bg-red-600 hover:brightness-110"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No statements/questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 text-sm text-gray-600">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * pageSize, tableData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {tableData.length}
            </span>{" "}
            entries
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={closeEditModal} popup>
        <div
          className="p-6"
          style={{
            minHeight: "550px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {editingQuestion && (
            <EditQuestionForm
              questionId={editingQuestion.id}
              initialCourseId={
                courses.find((c) => c.courseName === editingQuestion.course)
                  ?.courseId ?? null
              }
              initialCategory={editingQuestion.category}
              initialStatement={editingQuestion.content}
              onSuccess={onEditSuccess}
              onCancel={closeEditModal}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
