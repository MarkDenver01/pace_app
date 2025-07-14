import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Modal, Pagination, Button as FlowbiteButton, ModalHeader, ModalBody } from "flowbite-react";

interface Course {
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

const initialCourses: Course[] = [
  {
    name: "Graphic Design",
    description: "Design principles, tools & creative design skills",
    status: "Active",
  },
  {
    name: "Cyber Security",
    description: "Understand threats, protection & ethical thinking",
    status: "Inactive",
  },
];

type ActionType = "activate" | "deactivate" | null;

export default function CourseManagement() {
  const [courses, setCourses] = useState(initialCourses);
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

  const openModal = (course: Course, type: ActionType) => {
    setSelectedCourse(course);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedCourse || !actionType) return;

    const updatedStatus = actionType === "activate" ? "Active" : "Inactive";

    setCourses((prev) =>
      prev.map((c) =>
        c.name === selectedCourse.name ? { ...c, status: updatedStatus } : c
      )
    );

    setShowModal(false);
    setSelectedCourse(null);
    setActionType(null);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-[#D94022]" />
        <h2 className="text-xl font-semibold text-gray-700">Course Management</h2>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300 text-sm text-left text-gray-700">
        <thead className="bg-[#D94022] text-white">
        <tr>
          <th className="p-3 border border-gray-300 font-medium">Course Name</th>
          <th className="p-3 border border-gray-300 font-medium">Description</th>
          <th className="p-3 border border-gray-300 font-medium">Status</th>
          <th className="p-3 border border-gray-300 font-medium">Actions</th>
        </tr>
        </thead>
        <tbody className="bg-gray-50">
        {paginatedData.length > 0 ? (
          paginatedData.map((course) => (
            <tr key={course.name} className="hover:bg-[#FFEFEA] transition">
              <td className="p-3 border border-gray-300 font-medium">{course.name}</td>
              <td className="p-3 border border-gray-300">{course.description}</td>
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
            <td colSpan={4} className="p-4 text-center text-gray-500 border border-gray-300">
              No courses available.
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-6 text-sm text-gray-600">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * pageSize, courses.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{courses.length}</span>{" "}
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

      {/* Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-700">
              Are you sure you want to{" "}
              <span className={actionType === "activate" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {actionType === "activate" ? "activate" : "deactivate"}
              </span>{" "}
              the course:{" "}
              <span className="font-semibold">{selectedCourse?.name}</span>?
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
