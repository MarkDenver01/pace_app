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
  getOrCreateDynamicLink,
  updateDynamicLinkToken,
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

    // Get existing or create new link
    let { link: currentLink } = await getOrCreateDynamicLink(Number(universityId));

    if (!currentLink || typeof currentLink !== "string") {
      throw new Error("Invalid link from backend.");
    }

    // Normalize for display
    if (currentLink.includes("/universityId=")) {
      currentLink = currentLink.replace("/universityId=", "?universityId=");
    }

    // Ask admin to regenerate
    const decision = await Swal.fire({
      icon: "question",
      title: "App Link Already Exists",
      text: "A dynamic link already exists for this university. Do you want to generate a new one?",
      showCancelButton: true,
      confirmButtonText: "Yes, Generate New Link",
      cancelButtonText: "No, Keep Current Link",
      reverseButtons: true,
    });

    // If confirmed, update token
    if (decision.isConfirmed) {
      const updated = await updateDynamicLinkToken(Number(universityId));
      currentLink = updated.link.replace("/universityId=", "?universityId=");
    }

    // Display final link
    await Swal.fire({
      icon: "info",
      title: "Shareable App Link",
      html: `
        <p>Copy or share this link:</p>
        <input type="text" readonly value="${currentLink}" 
          style="width:100%;padding:5px;border:1px solid #ccc;border-radius:4px;" />
      `,
      showCancelButton: true,
      confirmButtonText: "Copy Link",
      cancelButtonText: "Close",
      preConfirm: () => currentLink,
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
          .catch(() => {
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
    console.error("Error handling dynamic link:", error);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: `Could not process dynamic link. Reason: ${error.message || error}`,
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
