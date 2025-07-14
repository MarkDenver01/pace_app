import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Pagination } from "flowbite-react";

interface StudentActivity {
  studentName: string;
  course: string;
  status: "Completed" | "In Progress";
  lastActive: string;
}

const initialData: StudentActivity[] = [
  { studentName: "Madison Mae", course: "Web Development", status: "Completed", lastActive: "2 hrs ago" },
  { studentName: "Joanne Legaspi", course: "Programming", status: "Completed", lastActive: "3 hrs ago" },
];

export default function DashboardDataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(initialData.length / pageSize);
  const paginatedData = initialData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 card-theme rounded-xl shadow-md overflow-x-auto border" style={{ backgroundColor: "var(--card-color)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5" style={{ color: "var(--button-color)" }} />
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
            Recent Student Activity
          </h2>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-left" style={{ color: "var(--text-color)" }}>
        <thead style={{ backgroundColor: "var(--button-color)", color: "#fff" }}>
        <tr>
          <th className="p-3 border border-gray-300 font-medium">Student Name</th>
          <th className="p-3 border border-gray-300 font-medium">Course</th>
          <th className="p-3 border border-gray-300 font-medium">Status</th>
          <th className="p-3 border border-gray-300 font-medium">Last Active</th>
        </tr>
        </thead>
        <tbody>
        {paginatedData.length > 0 ? (
          paginatedData.map((activity, idx) => (
            <tr
              key={idx}
              className="transition"
              style={{
                backgroundColor: "var(--card-color)",
              }}
            >
              <td className="p-3 border border-gray-300 font-medium">{activity.studentName}</td>
              <td className="p-3 border border-gray-300">{activity.course}</td>
              <td className="p-3 border border-gray-300">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      activity.status === "Completed"
                        ? "text-green-700 bg-green-100"
                        : "text-yellow-700 bg-yellow-100"
                    }`}
                  >
                    {activity.status}
                  </span>
              </td>
              <td className="p-3 border border-gray-300">{activity.lastActive}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className="p-4 text-center border border-gray-300"
              style={{ color: "var(--muted-text-color)" }}
            >
              No recent activity found.
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
              {Math.min(currentPage * pageSize, initialData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
              {initialData.length}
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
