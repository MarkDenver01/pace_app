import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import DashboardTable from "./DashboardDataTable.tsx";
import { useEffect, useState } from "react";
import { type StudentListResponse } from "../../../libs/models/response/StudentListResponse.ts";
import {
  fetchApprovedStudents,
  totalActiveCourseByUniversity,
  getUniversityActivationLink,
} from "../../../libs/ApiResponseService";
import { utils } from "../../../utils/utils.ts";
import { useAuth } from "../../../context/AuthContext.tsx";
import Swal from "sweetalert2";

// UI components
import {
  Button,
  Modal,
  Label,
  Textarea,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [approvedStudents, setApprovedStudents] =
    useState<StudentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeCourseCount, setActiveCourseCount] = useState<number>(0);

  // For Share Post modal
  const [openModal, setOpenModal] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // Fetch approved students
  const loadApprovedStudents = async () => {
    try {
      const studentResponse = await fetchApprovedStudents();
      setApprovedStudents(studentResponse);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch approved students: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active courses by university
  const loadActiveCourses = async () => {
    if (!user?.adminResponse?.universityId) return;
    try {
      const count = await totalActiveCourseByUniversity(
        Number(user.adminResponse.universityId)
      );
      setActiveCourseCount(count);
    } catch (error) {
      console.error("Failed to fetch the active courses: ", error);
    }
  };

  useEffect(() => {
    loadApprovedStudents();
    loadActiveCourses();
  }, [user]);


const handleSharePost = async () => {
  try {
    const universityId = localStorage.getItem("authorized_university_id");
    if (!universityId) throw new Error("No university associated.");

    // Fetch link directly from backend
    const { link: backendLink } = await getUniversityActivationLink(Number(universityId));
    if (!backendLink || typeof backendLink !== "string") throw new Error("Invalid link from backend.");

    // --- Normalize URL ---
    // Ensure it uses ? instead of / before query params
    let fixedLink = backendLink;

    if (fixedLink.includes("/universityId=")) {
      fixedLink = fixedLink.replace("/universityId=", "?universityId=");
    }

    // Ensure correct query param formatting (avoid duplicate ?)
    fixedLink = fixedLink.replace(/\?universityId=(\d+)\?/, "?universityId=$1&");

    console.log("Final shareable link:", fixedLink);

    // --- Show modal to copy ---
    await Swal.fire({
      icon: "info",
      title: "Generated Share Link",
      html: `
        <p>Copy the link below to share or open it on Android:</p>
        <input type="text" readonly value="${fixedLink}" style="width:100%;padding:5px;border:1px solid #ccc;border-radius:4px;" />
      `,
      showCancelButton: true,
      confirmButtonText: "Copy Link",
      cancelButtonText: "Cancel",
      preConfirm: () => fixedLink,
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(result.value)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Copied!",
              text: "Link copied to clipboard.",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((err) => {
            console.error("Copy failed:", err);
            Swal.fire({
              icon: "error",
              title: "Copy Failed",
              text: "Could not copy link to clipboard.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });

  } catch (error: any) {
    console.error("Error generating link:", error);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: `Could not generate activation link. Reason: ${error.message || error}`,
      confirmButtonColor: "#d33",
    });
  }
};

  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border";

  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };

  const labelStyle = {
    color: "var(--button-color)",
  };

  const valueStyle = {
    color: "var(--text-color)",
  };

  const descStyle = {
    color: "var(--muted-text-color, #6b7280)",
  };

  return (
    <div className="p-4 flex flex-col gap-8">
      {/* Header Section with Share Post Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
          Dashboard Overview
        </h2>
        <Button color="blue" onClick={handleSharePost}>
          Share University Link
        </Button>
      </div>

    
      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Students */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <GraduationCap size={28} />
            </div>
            <span className="text-sm font-semibold" style={labelStyle}>
              Total Students
            </span>
          </div>
          <div className="text-4xl font-bold" style={valueStyle}>
            {loading ? "Loading..." : approvedStudents?.total || 0}
          </div>
          <div className="text-xs" style={descStyle}>
            {utils.getTimeAgo(lastUpdated)}
          </div>
        </div>

        {/* Card 2: Active Courses */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <BookOpen size={28} />
            </div>
            <span className="text-sm font-semibold" style={labelStyle}>
              Active Courses
            </span>
          </div>
          <div className="text-4xl font-bold" style={valueStyle}>
            {loading ? "Loading..." : activeCourseCount}
          </div>
          <div className="text-xs" style={descStyle}>
            Live courses currently running
          </div>
        </div>

        {/* Card 3: Assessments Completed */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <ClipboardCheck size={28} />
            </div>
            <span className="text-sm font-semibold" style={labelStyle}>
              Assessments Completed
            </span>
          </div>
          <div className="text-4xl font-bold" style={valueStyle}>
            430
          </div>
          <div className="text-xs" style={descStyle}>
            Since last month
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-t my-2"
        style={{ borderColor: "var(--divider-color)" }}
      />

      {/* Table Section */}
      <div className="p-2">
        <DashboardTable />
      </div>
    </div>
  );
}
