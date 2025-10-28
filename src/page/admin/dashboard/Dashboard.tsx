import {
GraduationCap,
BookOpen,
ClipboardCheck,
University,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type StudentResponse } from "../../../libs/models/response/StudentResponse";
import {
fetchStudents,
totalActiveCourseByUniversity,
getOrCreateDynamicLink,
updateDynamicLinkToken,
getUniversityStats,
getTopCourses, 
getTopCompetitors
} from "../../../libs/ApiResponseService";
import { type UniversityStatsResponse } from "../../../libs/models/response/UniversityStats";
import { type TopCourseResponse } from "../../../libs/models/response/TopCourseResponse";
import { type TopCompetitorResponse } from "../../../libs/models/response/TopCompetitorResponse"; 
import { utils } from "../../../utils/utils";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import {
Button,
Modal,
Label,
TextInput,
ModalHeader,
ModalBody,
ModalFooter,
} from "flowbite-react";

export default function Dashboard() {
const { user } = useAuth();
const [students, setStudents] = useState<StudentResponse[]>([]);
const [loading, setLoading] = useState(true);
const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
const [activeCourseCount, setActiveCourseCount] = useState<number>(0);

const [universityName, setUniversityName] = useState(
user?.adminResponse?.universityName || "Unknown University"
);
const [domainEmail, setDomainEmail] = useState(
user?.adminResponse?.domainEmail || "university@example.com");

const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [newUniversityName, setNewUniversityName] = useState(universityName);
const [newDomainEmail, setNewDomainEmail] = useState(domainEmail);

// ✅ Backend metrics
const [universityStats, setUniversityStats] = useState<UniversityStatsResponse | null>(null);

const [topCourses, setTopCourses] = useState<string[]>([]);
const [topCompetitorSchools, setTopCompetitorSchools] = useState<string[]>([]);


const universityId = Number(localStorage.getItem("authorized_university_id"));

const loadStudents = async () => {
if (!universityId) return;
try {
const studentResponse = await fetchStudents(universityId);
setStudents(studentResponse);
setLastUpdated(new Date());
} catch (error) {
console.error("Failed to fetch students: ", error);
} finally {
setLoading(false);
}
};

const loadActiveCourses = async () => {
if (!user?.adminResponse?.universityId) return;
try {
const count = await totalActiveCourseByUniversity(Number(user.adminResponse.universityId));
setActiveCourseCount(count);
} catch (error) {
console.error("Failed to fetch the active courses: ", error);
}
};

const loadUniversityStats = async () => {
if (!universityId) return;
try {
const stats = await getUniversityStats(universityId);
setUniversityStats(stats);
} catch (error) {
console.error("Failed to fetch university stats:", error);
}
};

const loadTopCourses = async () => {
  if (!universityId) return;
  try {
    const currentMonth = new Date().getMonth() + 1;
    const courses: TopCourseResponse[] = await getTopCourses(universityId, currentMonth);
    setTopCourses(courses.map(c => c.courseDescription));
  } catch (error) {
    console.error("Failed to fetch top courses:", error);
  }
};

const loadTopCompetitors = async () => {
  if (!universityId) return;
  try {
    const competitors: TopCompetitorResponse[] = await getTopCompetitors(universityId);
    setTopCompetitorSchools(competitors.map(c => c.competitorName));
  } catch (error) {
    console.error("Failed to fetch top competitors:", error);
  }
};

useEffect(() => {
loadStudents();
loadActiveCourses();
loadUniversityStats();
loadTopCourses();     
  loadTopCompetitors(); 
}, [user]);

const handleSharePost = async () => {
try {
if (!universityId) throw new Error("No university associated.");
let { link: currentLink } = await getOrCreateDynamicLink(universityId);

  if (!currentLink || typeof currentLink !== "string") {
    throw new Error("Invalid link from backend.");
  }
  if (currentLink.includes("/universityId=")) {
    currentLink = currentLink.replace("/universityId=", "?universityId=");
  }

  const decision = await Swal.fire({
    icon: "question",
    title: "App Link Already Exists",
    text: "A dynamic link already exists for this university. Do you want to generate a new one?",
    showCancelButton: true,
    confirmButtonText: "Yes, Generate New Link",
    cancelButtonText: "No, Keep Current Link",
    reverseButtons: true,
  });

  if (decision.isConfirmed) {
    const updated = await updateDynamicLinkToken(universityId);
    currentLink = updated.link.replace("/universityId=", "?universityId=");
  }

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
      navigator.clipboard
        .writeText(result.value)
        .then(() =>
          Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Link copied to clipboard.",
            timer: 2000,
            showConfirmButton: false,
          })
        )
        .catch(() =>
          Swal.fire({
            icon: "error",
            title: "Copy Failed",
            text: "Could not copy link to clipboard.",
            confirmButtonColor: "#d33",
          })
        );
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

const handleSaveUniversityInfo = () => {
setUniversityName(newUniversityName);
setDomainEmail(newDomainEmail);
setIsEditModalOpen(false);
Swal.fire({
icon: "success",
title: "Updated Successfully",
text: "University information has been updated.",
timer: 2000,
showConfirmButton: false,
});
};

const cardClass =
"flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition border min-h-[180px] card-theme";
const iconWrapperStyle = {
backgroundColor: "var(--button-color)10",
color: "var(--button-color)",
};
const labelStyle = { color: "var(--button-color)", fontSize: "0.875rem" };
const valueStyle = { color: "var(--text-color)", fontSize: "1.5rem" };
const descStyle = {
color: "var(--muted-text-color, #6b7280)",
fontSize: "0.75rem",
};

const dashboardCards = [
{
label: "University Information",
icon: <University size={28} />,
value: universityName,
description: domainEmail,
onClick: () => setIsEditModalOpen(true),
isUppercase: true,
extraDesc: "Tap to edit details",
},
{
label: "Total Students",
icon: <GraduationCap size={28} />,
value: loading ? "Loading..." : students.length,
description: lastUpdated ? utils.getTimeAgo(lastUpdated) : "",
},
{
label: "Active Courses",
icon: <BookOpen size={28} />,
value: loading ? "Loading..." : activeCourseCount,
description: "Live courses currently running",
},
{
label: "Assessments Completed",
icon: <ClipboardCheck size={28} />,
value: universityStats?.totalAssessments ?? "—",
description: "Total student assessments",
},
{
label: "Students - Same School",
icon: <ClipboardCheck size={28} />,
value: universityStats?.totalSameSchool ?? "—",
description: "Enrolled in same school",
},
{
label: "Students - Other School",
icon: <University size={28} />,
value: universityStats?.totalOtherSchool ?? "—",
description: "Enrolled in other school",
},
{
label: "Students - New School",
icon: <GraduationCap size={28} />,
value: universityStats?.totalNewSchool ?? "—",
description: "Enrolled in new school",
},
{
  label: "Top 5 Courses",
  icon: <BookOpen size={28} />,
  value: topCourses.join(", ") || "—",
  description: "This month",
},
{
  label: "Top 3 Competitor Schools",
  icon: <University size={28} />,
  value: topCompetitorSchools.join(", ") || "—",
  description: "Competing universities",
},
];

return (
<div className="p-4 flex flex-col gap-8">
<div className="flex justify-between items-center">
<h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
Dashboard Overview
</h2>
<Button color="blue" onClick={handleSharePost}>
Share University Link
</Button>
</div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {dashboardCards.map((card, index) => (
      <div
        key={index}
        className={cardClass + (card.onClick ? " cursor-pointer" : "")}
        style={{
          borderColor: "var(--divider-color)",
          backgroundColor: "var(--card-color)",
        }}
        onClick={card.onClick}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            {card.icon}
          </div>
          <span style={labelStyle}>{card.label}</span>
        </div>

        <div
          className={`font-bold ${card.isUppercase ? "uppercase" : ""}`}
          style={{
            color: valueStyle.color,
            fontSize: valueStyle.fontSize,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {card.value}
        </div>

        {card.description && <div style={descStyle}>{card.description}</div>}
        {card.extraDesc && (
          <div className="text-xs italic text-gray-400 truncate">
            {card.extraDesc}
          </div>
        )}
      </div>
    ))}
  </div>

  <div
    className="border-t my-4"
    style={{ borderColor: "var(--divider-color)" }}
  />

  <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="md">
    <ModalHeader>Edit University Information</ModalHeader>
    <ModalBody>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="universityName">University Name</Label>
          <TextInput
            id="universityName"
            type="text"
            value={newUniversityName}
            onChange={(e) => setNewUniversityName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="domainEmail">Domain Email</Label>
          <TextInput
            id="domainEmail"
            type="email"
            value={newDomainEmail}
            onChange={(e) => setNewDomainEmail(e.target.value)}
          />
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="blue" onClick={handleSaveUniversityInfo}>
        Save
      </Button>
      <Button color="gray" onClick={() => setIsEditModalOpen(false)}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
</div>


);
}