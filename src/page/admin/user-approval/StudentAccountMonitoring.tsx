import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Pagination } from "flowbite-react";
import { approveStudent, fetchPendingStudents } from "../../../libs/ApiResponseService";
import { type StudentResponse } from "../../../libs/models/response/StudentResponse";
import { format, toZonedTime  } from "date-fns-tz";
import Swal from 'sweetalert2';
import { getSwalTheme } from "../../../utils/getSwalTheme";


type ActionType = "approve" | "reject" | null;

export default function StudentAccountMonitoring() {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(students.length / pageSize);
  const paginatedData = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const timezone = 'Asia/Manila'; // GMT+8
  
  const handleAction = async (student: StudentResponse, type: ActionType) => {

    const result = await Swal.fire({
      title: `Are you sure you want to ${type} ${student.userName}'s account?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: type === "approve" ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
      ...getSwalTheme(),
    });

    if (result.isConfirmed) {
      try {
        const newStatus = type === "approve" ? "APPROVED" : "REJECTED";
        await approveStudent(student.email, newStatus);

        setStudents((prev) =>
          prev.filter((s) => s.studentId !== student.studentId)
        );

        await Swal.fire({
          title: `${type === "approve" ? "Approved" : "Rejected"}!`,
          text: `Student ${student.userName}'s account has been ${type}d.`,
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating student status:", error);
        await Swal.fire({
          title: "Error",
          text: "There was a problem updating the student status.",
          icon: "error",
          ...getSwalTheme(),
        });
      }
    }
  };

  useEffect(() => {
    const loadPendingStudents = async () => {
      try {
        const response = await fetchPendingStudents(); // Replace with fetchPendingStudents if needed
        const pending = response.students.filter(
          (student) => student.userAccountStatus === "PENDING"
        );
        setStudents(pending);
      } catch (error) {
        console.error("Failed to load pending students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPendingStudents();
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
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
            Pending Students Account
          </h2>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-left" style={{ color: "var(--text-color)" }}>
        <thead style={{ backgroundColor: "var(--button-color)", color: "#fff" }}>
        <tr>
          <th className="p-3 border border-gray-300 font-medium">Student Name</th>
          <th className="p-3 border border-gray-300 font-medium">Email</th>
          <th className="p-3 border border-gray-300 font-medium">Requested Date</th>
          <th className="p-3 border border-gray-300 font-medium">Actions</th>
        </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="p-4 text-center border border-gray-300">
                Loading...
              </td>
            </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((student) => (
              <tr key={student.studentId} className="transition hover:bg-[var(--divider-color)]">
                <td className="p-3 border border-gray-300 font-medium">{student.userName}</td>
                <td className="p-3 border border-gray-300">{student.email}</td>
                <td className="p-3 border border-gray-300">{student.requestedDate 
                ? format(toZonedTime(new Date(student.requestedDate), timezone), "MMM dd, yyyy hh:mm a") : "No date"}
                </td>
                <td className="p-3 border border-gray-300 space-x-2">
                  <button onClick={() => handleAction(student, "approve")}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                  >
                    Approve
                    </button>
                    <button onClick={() => handleAction(student, "reject")}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition">
                      Reject
                    </button>
                </td>
              </tr>
              ))
            ) : (
            <tr>
              <td colSpan={4} className="p-4 text-center border border-gray-300">
                No pending student accounts.
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
              {Math.min(currentPage * pageSize, students.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
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
