import { useEffect, useState } from "react";
import { ChevronUpSquareIcon } from "lucide-react";
import {
  Button,
  Label,
  Pagination,
  Textarea,
  TextInput,
  Modal,
} from "flowbite-react";
import { saveCourse, getAllCourses } from "../../../libs/ApiResponseService";
import type { CourseResponse, CourseRequest } from "../../../libs/models/Course";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";
import EditCourseForm from "./SuperUpdateCourse";
import CareerModal from "./SuperCareerUpdate"; 

export default function CourseTableLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [selectedCareerCourse, setSelectedCareerCourse] = useState<CourseResponse | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setErrorCourses(null);
    try {
      const data: CourseResponse[] = await getAllCourses();
      setCourses(data);
    } catch (error: any) {
      setErrorCourses(error.message || "Failed to fetch courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSave = async () => {
    if (!courseName.trim() || !description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Fields Empty",
        text: "Please fill in all fields.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }

    const newCourseRequest: CourseRequest = {
      courseName: courseName.trim(),
      courseDescription: description.trim(),
      status: "Active",
    };

    try {
      setLoading(true);
      const savedCourse: CourseResponse = await saveCourse(newCourseRequest);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "New course has been added successfully.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });

      setCourses((prev) => [...prev, savedCourse]);
      setCurrentPage(1);
      setCourseName("");
      setDescription("");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to add new course.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course: CourseResponse) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleCareerClick = (course: CourseResponse) => {
    setSelectedCareerCourse(course);
    setIsCareerModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    fetchCourses();
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 5;
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md card-theme border border-orange-600";
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

      {/* Add Course Form */}
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

          <div>
            <Label htmlFor="description" className="text-sm" style={valueStyle}>
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief course description..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={!courseName || !description || loading}
            >
              {loading ? "Saving new course..." : "Add New Course"}
            </Button>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="border-t" style={{ borderColor: "var(--divider-color)" }} />
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full" style={iconWrapperStyle}>
          <ChevronUpSquareIcon size={20} />
        </div>
        <h3 className="text-lg font-semibold" style={labelStyle}>
          Course List
        </h3>
      </div>

      <TextInput
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-64 border border-orange-600 rounded-lg"
      />

      {loadingCourses && <p>Loading courses...</p>}
      {errorCourses && <p className="text-red-500">{errorCourses}</p>}

      {!loadingCourses && !errorCourses && (
        <div className="overflow-auto rounded-lg shadow border border-orange-600 mt-3">
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
                    key={course.courseId}
                    className="hover:bg-[#FFEFEA] dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3">{course.courseId}</td>
                    <td className="p-3">{course.courseName}</td>
                    <td className="p-3">{course.courseDescription}</td>
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
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(course)}
                          className="text-xs font-medium text-white bg-[var(--button-color)] px-4 py-1.5 rounded hover:opacity-90"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCareerClick(course)}
                          className="text-xs font-medium text-white bg-green-600 px-4 py-1.5 rounded hover:opacity-90"
                        >
                          Add Career
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
      )}

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
              {Math.min(currentPage * pageSize, courses.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{courses.length}</span>{" "}
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

      {/* Career Modal */}
      <Modal show={isCareerModalOpen} onClose={() => setIsCareerModalOpen(false)} popup>
        <div className="p-6">
          {selectedCareerCourse && (
            <CareerModal
              courseId={selectedCareerCourse.courseId}
              onClose={() => setIsCareerModalOpen(false)}
            />
          )}
        </div>
      </Modal>

      {/* ✏️ Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} popup>
        <div className="p-6">
          {selectedCourse && (
            <EditCourseForm
              courseId={selectedCourse.courseId}
              existingCourse={selectedCourse}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
