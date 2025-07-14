import { useState } from "react";
import { FileBarChart2, CalendarDays, Search } from "lucide-react";
import { Pagination, TextInput } from "flowbite-react";

interface ReportData {
  date: string;
  user: string;
  activity: string;
  duration: string;
}

const initialReports: ReportData[] = [
  {
    date: "05/14/2025",
    user: "Joanne Legazpi",
    activity: "Assessment Completed",
    duration: "25 mins",
  },
];

export default function ReportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 5;

  const filteredData = initialReports.filter((item) => {
    const matchesDate = dateFilter ? item.date.includes(dateFilter) : true;
    const matchesSearch =
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.activity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div
      className="p-6 rounded-xl shadow-md overflow-x-auto border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-4">
        <FileBarChart2 className="w-5 h-5" style={{ color: "var(--button-color)" }} />
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
          Engagement & Performance Report
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full sm:max-w-xs">
          <CalendarDays className="w-5 h-5" style={{ color: "var(--muted-text-color)" }} />
          <TextInput
            type="text"
            placeholder="Filter by date (mm/dd/yyyy)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Search Filter */}
        <div className="flex items-center gap-2 w-full sm:max-w-sm">
          <Search className="w-5 h-5" style={{ color: "var(--muted-text-color)" }} />
          <TextInput
            type="text"
            placeholder="Search user or activity"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Data Table */}
      <table className="min-w-full text-sm text-left" style={{ color: "var(--text-color)" }}>
        <thead style={{ backgroundColor: "var(--button-color)", color: "#ffffff" }}>
        <tr>
          <th className="p-3 border border-gray-300 font-medium">Date</th>
          <th className="p-3 border border-gray-300 font-medium">User</th>
          <th className="p-3 border border-gray-300 font-medium">Activity</th>
          <th className="p-3 border border-gray-300 font-medium">Duration (mins)</th>
        </tr>
        </thead>
        <tbody>
        {paginatedData.length > 0 ? (
          paginatedData.map((report, index) => (
            <tr key={index} className="transition hover:bg-[var(--divider-color)]">
              <td className="p-3 border border-gray-300">{report.date}</td>
              <td className="p-3 border border-gray-300">{report.user}</td>
              <td className="p-3 border border-gray-300">{report.activity}</td>
              <td className="p-3 border border-gray-300">{report.duration}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className="p-4 text-center border border-gray-300"
              style={{ color: "var(--muted-text-color)" }}
            >
              No report data found.
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
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>
              {filteredData.length}
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
