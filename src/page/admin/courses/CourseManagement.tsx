import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import {
  Modal,
  Pagination,
  Button as FlowbiteButton,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import {
  getAllCoursesByUniversity,
  activateCourse,
  deactivateCourse,
} from "../../../libs/ApiResponseService";
import { useAuth } from "../../../context/AuthContext";

interface Course {
  courseId: number;
  courseName: string;
  courseDescription: string;
  status: string;
}

type ActionType = "activate" | "deactivate" | null;

export default function CourseManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);

  const totalPages = Math.ceil(courses.length / pageSize);
  const paginatedData = courses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Fetch courses from API
  const fetchCourses = async () => {
    if (!user?.adminResponse?.universityId) return;
    try {
      const data = await getAllCoursesByUniversity(
        Number(user.adminResponse.universityId)
      );
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openModal = (course: Course, type: ActionType) => {
    setSelectedCourse(course);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedCourse || !actionType) return;

    try {
      if (actionType === "activate") {
        await activateCourse(selectedCourse.courseId);
      } else {
        await deactivateCourse(selectedCourse.courseId);
      }
      await fetchCourses(); // Refresh after update
    } catch (error) {
      console.error("Failed to update course status:", error);
    } finally {
      setShowModal(false);
      setSelectedCourse(null);
      setActionType(null);
    }
  };

  return (
    <div
      className="p-6 rounded-xl shadow-md overflow-x-auto border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5" style={{ color: "var(--button-color)" }} />
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
          Course Management
        </h2>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-left" style={{ color: "var(--text-color)" }}>
        <thead style={{ backgroundColor: "var(--button-color)", color: "#fff" }}>
          <tr>
            <th className="p-3 border border-gray-300 font-medium">Course Name</th>
            <th className="p-3 border border-gray-300 font-medium">Description</th>
            <th className="p-3 border border-gray-300 font-medium">Status</th>
            <th className="p-3 border border-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((course) => (
              <tr key={course.courseId} className="transition hover:bg-[var(--divider-color)]">
                <td className="p-3 border border-gray-300 font-medium">{course.courseName}</td>
                <td className="p-3 border border-gray-300">{course.courseDescription}</td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === "Active"
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="p-3 border border-gray-300 space-x-2">
                  <button
                    onClick={() => openModal(course, "activate")}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => openModal(course, "deactivate")}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="p-4 text-center border border-gray-300"
                style={{ color: "var(--muted-text-color)" }}
              >
                No courses available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-6 text-sm">
          <span style={{ color: "var(--muted-text-color)" }}>
            Showing{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
              {Math.min(currentPage * pageSize, courses.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
              {courses.length}
            </span>{" "}
            entries
          </span>
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons
            />
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal" style={{ color: "var(--text-color)" }}>
              Are you sure you want to{" "}
              <span
                className={`font-semibold ${
                  actionType === "activate" ? "text-green-600" : "text-red-600"
                }`}
              >
                {actionType === "activate" ? "activate" : "deactivate"}
              </span>{" "}
              the course:{" "}
              <span className="font-semibold">{selectedCourse?.courseName}</span>?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <FlowbiteButton color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </FlowbiteButton>
              <FlowbiteButton
                color={actionType === "activate" ? "success" : "failure"}
                onClick={handleConfirm}
              >
                {actionType === "activate" ? "Yes, Activate" : "Yes, Deactivate"}
              </FlowbiteButton>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
