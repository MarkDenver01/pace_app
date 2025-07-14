import { useState } from "react";
import { Users } from "lucide-react";
import { Pagination, Modal, Button as FlowbiteButton, ModalHeader, ModalBody } from "flowbite-react";

interface PendingStudent {
  name: string;
  email: string;
  requestedDate: string;
}

const initialStudents: PendingStudent[] = [
  {
    name: "Madizon Mae",
    email: "madizon@gmail.com",
    requestedDate: "05/23/25",
  },
  {
    name: "Joanne Legazpi",
    email: "joanne.legazpi@gmail.com",
    requestedDate: "05/23/25",
  },
];

type ActionType = "approve" | "reject" | null;

export default function StudentAccountMonitoring() {
  const [students, setStudents] = useState(initialStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<PendingStudent | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);

  const totalPages = Math.ceil(students.length / pageSize);
  const paginatedData = students.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openModal = (student: PendingStudent, type: ActionType) => {
    setSelectedStudent(student);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedStudent || !actionType) return;

    setStudents((prev) => prev.filter((s) => s.email !== selectedStudent.email));
    setShowModal(false);
    setSelectedStudent(null);
    setActionType(null);

    // TODO: trigger backend API here
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-[#D94022]" />
          <h2 className="text-xl font-semibold text-gray-700">
            Pending Students Account
          </h2>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300 text-sm text-left text-gray-700">
        <thead className="bg-[#D94022] text-white">
        <tr>
          <th className="p-3 border border-gray-300 font-medium">Student Name</th>
          <th className="p-3 border border-gray-300 font-medium">Email</th>
          <th className="p-3 border border-gray-300 font-medium">Requested Date</th>
          <th className="p-3 border border-gray-300 font-medium">Actions</th>
        </tr>
        </thead>
        <tbody className="bg-gray-50">
        {paginatedData.length > 0 ? (
          paginatedData.map((student) => (
            <tr key={student.email} className="hover:bg-[#FFEFEA] transition">
              <td className="p-3 border border-gray-300 font-medium">{student.name}</td>
              <td className="p-3 border border-gray-300">{student.email}</td>
              <td className="p-3 border border-gray-300">{student.requestedDate}</td>
              <td className="p-3 border border-gray-300 space-x-2">
                <button
                  onClick={() => openModal(student, "approve")}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => openModal(student, "reject")}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="p-4 text-center text-gray-500 border border-gray-300">
              No pending student accounts.
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
              {Math.min(currentPage * pageSize, students.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{students.length}</span>{" "}
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
              <span className={actionType === "approve" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {actionType === "approve" ? "approve" : "reject"}
              </span>{" "}
              <span className="font-semibold">{selectedStudent?.name}</span>'s account?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <FlowbiteButton color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </FlowbiteButton>
              <FlowbiteButton
                color={actionType === "approve" ? "success" : "failure"}
                onClick={handleConfirm}
              >
                {actionType === "approve" ? "Yes, Approve" : "Yes, Reject"}
              </FlowbiteButton>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
