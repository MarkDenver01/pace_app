import { useEffect, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Pagination, Modal, Button, ModalHeader, ModalBody } from "flowbite-react";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";
import {
  getUniversityCourses,
  activateCourse,
  deactivateCourse,
  getAllCoursesForAdmin, // new: fetch all courses (super admin global list)
  assignCourseToUniversity, //  new: API to assign course to university
} from "../../../libs/ApiResponseService";

interface Course {
  courseId: number;
  courseName: string;
  courseDescription: string;
  status: string; // global status from super admin
}

interface UniversityCourse {
  id: number;
  status: string; // active/inactive (per university)
  course: Course;
}

type ActionType = "activate" | "deactivate";

export default function CourseManagement() {
  const [universityCourses, setUniversityCourses] = useState<UniversityCourse[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const universityId = localStorage.getItem("authorized_university_id");

  const totalPages = Math.ceil(universityCourses.length / pageSize);
  const paginatedData = universityCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Fetch university courses (activated or not)
  const fetchCourses = async () => {
    if (!universityId) return;
    try {
      const data = await getUniversityCourses(Number(universityId));
      setUniversityCourses(data);
    } catch (error) {
      console.error("Error fetching university courses:", error);
    }
  };

  // Fetch all courses from super admin
  const fetchAllCourses = async () => {
    try {
      const data = await getAllCoursesForAdmin();
      setAllCourses(data);
    } catch (error) {
      console.error("Error fetching all courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAllCourses();
  }, []);

  const handleAction = async (uc: UniversityCourse, type: ActionType) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${type} the course: ${uc.course.courseName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${type}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: type === "activate" ? "#16a34a" : "#dc2626",
      ...getSwalTheme(),
    });

    if (!result.isConfirmed) return;

    try {
      if (!universityId) throw new Error("No university ID found for current user.");

      if (type === "activate") {
        await activateCourse(uc.course.courseId, Number(universityId));
      } else {
        await deactivateCourse(uc.course.courseId, Number(universityId));
      }

      await fetchCourses();
      Swal.fire({
        icon: "success",
        title: `Course ${type}d!`,
        showConfirmButton: false,
        timer: 1500,
        ...getSwalTheme(),
      });
    } catch (error) {
      console.error("Failed to update course status:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating the course status.",
        ...getSwalTheme(),
      });
    }
  };

  const handleAssignCourse = async () => {
    if (!selectedCourseId || !universityId) return;

    try {
      await assignCourseToUniversity(Number(universityId), selectedCourseId);
      await fetchCourses();
      setShowModal(false);
      setSelectedCourseId(null);

      Swal.fire({
        icon: "success",
        title: "Course assigned!",
        showConfirmButton: false,
        timer: 1500,
        ...getSwalTheme(),
      });
    } catch (error) {
      console.error("Error assigning course:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to assign course to university.",
        ...getSwalTheme(),
      });
    }
  };

  // Filter available courses (not yet in university list)
  const availableCourses = allCourses.filter(
    (c) => !universityCourses.some((uc) => uc.course.courseId === c.courseId)
  );

  return (
    <div
      className="p-6 rounded-xl shadow-md overflow-x-auto border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: "var(--button-color)" }} />
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-color)" }}
          >
            Course Management
          </h2>
        </div>
        <Button color="blue" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Table */}
      <table
        className="min-w-full text-sm text-left"
        style={{ color: "var(--text-color)" }}
      >
        <thead
          style={{ backgroundColor: "var(--button-color)", color: "#fff" }}
        >
          <tr>
            <th className="p-3 border border-gray-300 font-medium">Course Name</th>
            <th className="p-3 border border-gray-300 font-medium">Description</th>
            <th className="p-3 border border-gray-300 font-medium">Status</th>
            <th className="p-3 border border-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((uc) => (
              <tr
                key={uc.id}
                className="transition hover:bg-[var(--divider-color)]"
              >
                <td className="p-3 border border-gray-300 font-medium">
                  {uc.course.courseName}
                </td>
                <td className="p-3 border border-gray-300">
                  {uc.course.courseDescription}
                </td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      uc.status === "Active"
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {uc.status}
                  </span>
                </td>
                <td className="p-3 border border-gray-300 space-x-2">
                  <button
                    onClick={() => handleAction(uc, "activate")}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                    disabled={uc.status === "Active"}
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleAction(uc, "deactivate")}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition"
                    disabled={uc.status === "Inactive"}
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
              {Math.min(currentPage * pageSize, universityCourses.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
              {universityCourses.length}
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

      {/* Add Course Modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <h3 className="mb-4 text-lg font-medium text-gray-900">Assign a Course</h3>
          {availableCourses.length > 0 ? (
            <select
              className="w-full p-2 border rounded-md"
              value={selectedCourseId ?? ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            >
              <option value="">-- Select a course --</option>
              {availableCourses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-600">All courses already assigned to this university.</p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={handleAssignCourse}
              disabled={!selectedCourseId}
            >
              Save
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
