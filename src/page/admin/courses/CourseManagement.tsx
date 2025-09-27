import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Pagination } from "flowbite-react";
import {
  getActiveCourses,
  activateCourse,
  deactivateCourse,
} from "../../../libs/ApiResponseService";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

interface Course {
  courseId: number;
  courseName: string;
  courseDescription: string;
  status: string;
}

type ActionType = "activate" | "deactivate";

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const universityId = localStorage.getItem("authorized_university_id");

  const totalPages = Math.ceil(courses.length / pageSize);
  const paginatedData = courses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Fetch only ACTIVE courses from API
  const fetchCourses = async () => {
    try {
      const data = await getActiveCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching active courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAction = async (course: Course, type: ActionType) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${type} the course: ${course.courseName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${type}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: type === "activate" ? "#16a34a" : "#dc2626",
      ...getSwalTheme(),
    });

    if (result.isConfirmed) {
      try {
        if (!universityId) {
          throw new Error("No university ID found for current user.");
        }

        if (type === "activate") {
          await activateCourse(course.courseId, Number(universityId));
        } else {
          await deactivateCourse(course.courseId, Number(universityId));
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
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Active Course Management
        </h2>
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
            paginatedData.map((course) => (
              <tr
                key={course.courseId}
                className="transition hover:bg-[var(--divider-color)]"
              >
                <td className="p-3 border border-gray-300 font-medium">
                  {course.courseName}
                </td>
                <td className="p-3 border border-gray-300">
                  {course.courseDescription}
                </td>
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
                    onClick={() => handleAction(course, "activate")}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleAction(course, "deactivate")}
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
                No active courses available.
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
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              {Math.min(currentPage * pageSize, courses.length)}
            </span>{" "}
            of{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
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
    </div>
  );
}
