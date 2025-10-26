import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Pagination } from "flowbite-react";
import { fetchStudents } from "../../../libs/ApiResponseService";
import { type StudentResponse } from "../../../libs/models/response/StudentResponse";
import { format, toZonedTime } from "date-fns-tz";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

export default function StudentAccountMonitoring() {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(students.length / pageSize);
  const paginatedData = students.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const timezone = "Asia/Manila";

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        setStudents(response); // backend returns a list, not {students: []}
      } catch (error) {
        console.error("Failed to load students:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch students. Please try again later.",
          icon: "error",
          ...getSwalTheme(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  return (
    <div
      className="p-6 rounded-xl shadow-md overflow-x-auto border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5" style={{ color: "var(--button-color)" }} />
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-color)" }}
          >
            Students Account Status
          </h2>
        </div>
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
            <th className="p-3 border border-gray-300 font-medium">Student Name</th>
            <th className="p-3 border border-gray-300 font-medium">Email</th>
            <th className="p-3 border border-gray-300 font-medium">University</th>
            <th className="p-3 border border-gray-300 font-medium">Requested Date</th>
            <th className="p-3 border border-gray-300 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="p-4 text-center border border-gray-300">
                Loading...
              </td>
            </tr>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((student) => (
              <tr
                key={student.studentId}
                className="transition hover:bg-[var(--divider-color)]"
              >
                <td className="p-3 border border-gray-300 font-medium">
                  {student.userName}
                </td>
                <td className="p-3 border border-gray-300">{student.email}</td>
                <td className="p-3 border border-gray-300">
                  {student.universityName ?? "N/A"}
                </td>
                <td className="p-3 border border-gray-300">
                  {student.requestedDate
                    ? format(
                        toZonedTime(new Date(student.requestedDate), timezone),
                        "MMM dd, yyyy hh:mm a"
                      )
                    : "No date"}
                </td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      student.userAccountStatus === "APPROVED"
                        ? "bg-green-500 text-white"
                        : student.userAccountStatus === "REJECTED"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {student.userAccountStatus}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center border border-gray-300">
                No student accounts found.
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
              {Math.min(currentPage * pageSize, students.length)}
            </span>{" "}
            of{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              {students.length}
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
