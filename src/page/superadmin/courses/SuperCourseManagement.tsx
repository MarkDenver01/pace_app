import { useState } from "react";
import { TabletsIcon } from "lucide-react";
import {
  Button,
  Label,
  Pagination,
  Textarea,
  TextInput,
} from "flowbite-react";

interface Course {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

const initialCourses: Course[] = [
  { id: 1, name: "Criminology", description: "Study of law & criminal justice", status: "Inactive" },
  { id: 2, name: "IT", description: "Programming", status: "Active" },
  { id: 3, name: "Nursing", description: "Healthcare and patient care", status: "Active" },
  { id: 4, name: "Education", description: "Teaching and pedagogy", status: "Inactive" },
];

export default function CourseTableLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  const pageSize = 5;
  const totalPages = Math.ceil(initialCourses.length / pageSize);
  const paginatedCourses = initialCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSave = () => {
    alert(`Course Saved:\nName: ${courseName}\nDescription: ${description}`);
    setCourseName("");
    setDescription("");
  };

  // THEME styles
  const cardClass = "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md card-theme border";
  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };
  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };

  return (
    <div className="p-4 flex flex-col gap-8">
      {/* Title */}
      <h2 className="text-2xl font-bold" style={valueStyle}>
        Course Management
      </h2>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Course */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
            Add New Course
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="courseName" className="text-sm" style={valueStyle}>
                Course Name
              </Label>
              <TextInput
                id="courseName"
                placeholder="Enter course name..."
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="mt-1"
              />
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
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Add Description */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
            Add Description
          </h3>
          <div>
            <Label htmlFor="description" className="text-sm" style={valueStyle}>
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief course description..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: "var(--divider-color)" }} />

      {/* Table Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full" style={iconWrapperStyle}>
          <TabletsIcon size={20} />
        </div>
        <h3 className="text-lg font-semibold" style={labelStyle}>
          Course List
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-xl mt-3">
        <table className="min-w-full text-sm text-left" style={valueStyle}>
          <thead style={{ backgroundColor: "var(--button-color)", color: "#fff" }}>
          <tr>
            <th className="p-3 font-medium">ID</th>
            <th className="p-3 font-medium">Course Name</th>
            <th className="p-3 font-medium">Description</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium text-center">Action</th>
          </tr>
          </thead>
          <tbody style={{ backgroundColor: "var(--card-color)" }}>
          {paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-[#FFEFEA] dark:hover:bg-gray-700 transition"
              >
                <td className="p-3">{course.id}</td>
                <td className="p-3">{course.name}</td>
                <td className="p-3">{course.description}</td>
                <td className="p-3">
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
                <td className="p-3">
                  <div className="flex justify-center">
                    <button className="text-xs font-medium text-white bg-[var(--button-color)] px-6 py-1.5 rounded hover:opacity-90">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No courses found.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

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
              {Math.min(currentPage * pageSize, initialCourses.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {initialCourses.length}
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
    </div>
  );
}
