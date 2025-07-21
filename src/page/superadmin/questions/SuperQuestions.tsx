import { useState } from "react";
import { TabletsIcon } from "lucide-react";
import {
  Button,
  Label,
  Pagination,
  Select,
  Textarea,
} from "flowbite-react";

const dummyCourses = ["Psychology", "IT", "Engineering"];

const initialData = [
  {
    id: 1,
    course: "Criminology",
    content: "I would like to understand analyze criminal...",
  },
];

const categorized = ["General Interest", "Career Interest", "Personal Quantities"];

export default function StatementQuestionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategorized] = useState("");
  const [statement, setStatement] = useState("");

  const pageSize = 5;
  const totalPages = Math.ceil(initialData.length / pageSize);
  const paginatedData = initialData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSave = () => {
    alert(`Saved:\nCourse: ${selectedCourse}\nStatement: ${statement}`);
    setSelectedCourse("");
    setSelectedCategorized("");
    setStatement("");
  };

  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md card-theme border";
  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };
  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };

  return (
    <div className="p-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold" style={valueStyle}>
        Statements & Questions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
            Course Related
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="course" className="text-sm" style={valueStyle}>
                Courses
              </Label>
              <Select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a course</option>
                {dummyCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </Select>
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

        {/* Right */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
            Statement / Questions
          </h3>
          <div>
            <Label htmlFor="category" className="text-sm" style={valueStyle}>
              Category
            </Label>
            <Select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategorized(e.target.value)}
            >
              <option value="">Select a category</option>
              {categorized.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="statement" className="text-sm" style={valueStyle}>
              Enter Statement / Questions
            </Label>
            <Textarea
              id="statement"
              placeholder="Enter Statement / Questions..."
              rows={6}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--divider-color)" }} />

      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full" style={iconWrapperStyle}>
          <TabletsIcon size={20} />
        </div>
        <h3 className="text-lg font-semibold" style={labelStyle}>
          Statement & Question List
        </h3>
      </div>

      <div className="overflow-auto border rounded-xl mt-3">
        <table className="min-w-full text-sm text-left" style={valueStyle}>
          <thead style={{ backgroundColor: "var(--button-color)", color: "#fff" }}>
          <tr>
            <th className="p-3 font-medium">ID</th>
            <th className="p-3 font-medium">Course</th>
            <th className="p-3 font-medium">Statement & Questions</th>
            <th className="p-3 font-medium text-center">Actions</th>
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
                <td className="p-3">{entry.content}</td>
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <button className="px-4 py-1 text-xs font-medium rounded text-white bg-green-600 hover:brightness-110">
                      Update
                    </button>
                    <button className="px-4 py-1 text-xs font-medium rounded text-white bg-red-600 hover:brightness-110">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No entries found.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 text-sm text-gray-600">
          <span>
            Showing <span className="font-semibold text-gray-800">{(currentPage - 1) * pageSize + 1}</span> to
            <span className="font-semibold text-gray-800"> {Math.min(currentPage * pageSize, initialData.length)}</span>
            of <span className="font-semibold text-gray-800">{initialData.length}</span> entries
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
