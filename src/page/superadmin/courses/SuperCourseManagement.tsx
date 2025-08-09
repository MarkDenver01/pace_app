import { useEffect, useState } from "react";
import { ChevronUpSquareIcon } from "lucide-react";
import {
  Button,
  Label,
  Pagination,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { getUniversities, saveCourse, getAllCourses } from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { CourseResponse, CourseRequest } from "../../../libs/models/Course";

interface CourseUI {
  id: number; // UI only, generated locally
  courseName: string;
  courseDescription: string;
  status: string;
}

export default function CourseTableLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [errorUnis, setErrorUnis] = useState<string | null>(null);

  const [courses, setCourses] = useState<CourseUI[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);

  // Fetch universities on mount
  useEffect(() => {
    async function fetchUniversities() {
      setLoadingUnis(true);
      setErrorUnis(null);
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch (error: any) {
        setErrorUnis(error.message || "Failed to fetch universities");
      } finally {
        setLoadingUnis(false);
      }
    }
    fetchUniversities();
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      setLoadingCourses(true);
      setErrorCourses(null);
      try {
        const data: CourseResponse[] = await getAllCourses();
        // Map backend response to UI Course array with generated ids
        const mapped = data.map((c, index) => ({
          id: index + 1,
          courseName: c.courseName as string,
          courseDescription: c.courseDescription as string,
          status: c.status as string,
        }));
        setCourses(mapped);
      } catch (error: any) {
        setErrorCourses(error.message || "Failed to fetch courses");
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  const pageSize = 5;
  const totalPages = Math.ceil(courses.length / pageSize);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSave = async () => {
    if (!courseName.trim() || !description.trim() || !selectedUniversity) {
      alert("Please fill in all fields and select a university.");
      return;
    }

    const newCourseRequest: CourseRequest = {
      courseName: courseName.trim(),
      courseDescription: description.trim(),
      universityId: selectedUniversity as number,
    };

    try {
      const savedCourse: CourseResponse = await saveCourse(newCourseRequest);
      alert("Course saved successfully!");

      // Append new saved course to the list with generated id
      setCourses((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          courseName: savedCourse.courseName as string,
          courseDescription: savedCourse.courseDescription as string,
          status: savedCourse.status as string,
        },
      ]);
      setCurrentPage(1);

      // Clear form fields
      setCourseName("");
      setDescription("");
      setSelectedUniversity("");
    } catch (error: any) {
      alert(error.message || "Failed to save course");
    }
  };

  // THEME styles
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
      {/* Title */}
      <h2 className="text-2xl font-bold" style={valueStyle}>
        Course Management
      </h2>

      {/* Add Course Form - FULL WIDTH */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold mb-2" style={valueStyle}>
          Add New Course
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="university" className="text-sm" style={valueStyle}>
              University
            </Label>
            {loadingUnis ? (
              <p>Loading universities...</p>
            ) : errorUnis ? (
              <p className="text-red-500 text-sm">{errorUnis}</p>
            ) : (
              <Select
                id="university"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(Number(e.target.value))}
                className="mt-1"
              >
                <option value="">Select a university...</option>
                {universities.map((uni) => (
                  <option key={uni.universityId} value={uni.universityId}>
                    {uni.universityName}
                  </option>
                ))}
              </Select>
            )}
          </div>

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
              disabled={!courseName || !selectedUniversity || !description}
              title={
                !courseName || !selectedUniversity || !description
                  ? "Fill all required fields"
                  : undefined
              }
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: "var(--divider-color)" }} />

      {/* Course List Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full" style={iconWrapperStyle}>
          <ChevronUpSquareIcon size={20} />
        </div>
        <h3 className="text-lg font-semibold" style={labelStyle}>
          Course List
        </h3>
      </div>

      {/* Loading or error for courses */}
      {loadingCourses && <p>Loading courses...</p>}
      {errorCourses && <p className="text-red-500">{errorCourses}</p>}

      {/* Courses Table */}
      {!loadingCourses && !errorCourses && (
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
    </div>
  );
}
