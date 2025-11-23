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
  getTopCompetitors,
  updateUniversityInfo,
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
  Checkbox,
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
    user?.adminResponse?.domainEmail || "university@example.com"
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable values in modal
  const [newUniversityName, setNewUniversityName] = useState(universityName);
  const [newDomainEmail, setNewDomainEmail] = useState(domainEmail);

  // Change password (optional)
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Stats
  const [universityStats, setUniversityStats] =
    useState<UniversityStatsResponse | null>(null);
  const [topCourses, setTopCourses] = useState<string[]>([]);
  const [topCompetitorSchools, setTopCompetitorSchools] = useState<string[]>([]);

  const universityId = Number(localStorage.getItem("authorized_university_id"));

  const loadStudents = async () => {
    if (!universityId) return;
    try {
      const res = await fetchStudents(universityId);
      setStudents(res);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveCourses = async () => {
    if (!user?.adminResponse?.universityId) return;
    try {
      const count = await totalActiveCourseByUniversity(
        Number(user.adminResponse.universityId)
      );
      setActiveCourseCount(count);
    } catch (error) {
      console.error("Failed to fetch active courses:", error);
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
      const month = new Date().getMonth() + 1;
      const courses: TopCourseResponse[] = await getTopCourses(universityId, month);
      setTopCourses(courses.map((c) => c.courseDescription));
    } catch (error) {
      console.error("Failed to fetch top courses:", error);
    }
  };

  const loadTopCompetitors = async () => {
    if (!universityId) return;
    try {
      const competitors: TopCompetitorResponse[] =
        await getTopCompetitors(universityId);
      setTopCompetitorSchools(competitors.map((c) => c.competitorName));
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

      let { link } = await getOrCreateDynamicLink(universityId);

      if (link.includes("/universityId=")) {
        link = link.replace("/universityId=", "?universityId=");
      }

      const decision = await Swal.fire({
        icon: "question",
        title: "App Link Already Exists",
        text: "A link exists. Generate a new one?",
        showCancelButton: true,
        confirmButtonText: "Generate New",
      });

      if (decision.isConfirmed) {
        const updated = await updateDynamicLinkToken(universityId);
        link = updated.link.replace("/universityId=", "?universityId=");
      }

      await Swal.fire({
        icon: "info",
        title: "Shareable Link",
        html: `
          <input type="text" readonly value="${link}"
          style="width:100%;padding:5px;border:1px solid #ccc;border-radius:4px;" />
        `,
        showCancelButton: true,
        confirmButtonText: "Copy",
        preConfirm: () => link,
      }).then((result) => {
        if (result.isConfirmed) {
          navigator.clipboard.writeText(result.value);
          Swal.fire({
            icon: "success",
            title: "Copied!",
            timer: 1800,
            showConfirmButton: false,
          });
        }
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error?.message || "Something went wrong.",
      });
    }
  };

  const handleSaveUniversityInfo = async () => {
    if (!universityId) {
      Swal.fire({
        icon: "error",
        title: "Missing University",
        text: "No university ID found. Please re-login.",
      });
      return;
    }

    if (changePassword && newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Error",
        text: "New password and confirm password must match.",
      });
      return;
    }

    try {
      setSaving(true);

      await updateUniversityInfo({
        universityId,
        universityName: newUniversityName,
        domainEmail: newDomainEmail,
        newPassword: changePassword ? newPassword : undefined,
        confirmPassword: changePassword ? confirmPassword : undefined,
      });

      // update local UI
      setUniversityName(newUniversityName);
      setDomainEmail(newDomainEmail);

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "University information updated.",
        timer: 2000,
        showConfirmButton: false,
      });

      // reset modal state
      setIsEditModalOpen(false);
      setChangePassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating university info:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.message || "Failed to update university information.",
      });
    } finally {
      setSaving(false);
    }
  };

  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition border min-h-[180px] card-theme";

  const dashboardCards = [
    {
      label: "University Information",
      icon: <University size={28} />,
      value: universityName,
      description: domainEmail,
      onClick: () => {
        setNewUniversityName(universityName);
        setNewDomainEmail(domainEmail);
        setChangePassword(false);
        setNewPassword("");
        setConfirmPassword("");
        setIsEditModalOpen(true);
      },
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
      description: "Live courses",
    },
    {
      label: "Assessments Completed",
      icon: <ClipboardCheck size={28} />,
      value: universityStats?.totalAssessments ?? "—",
      description: "Total assessments",
    },
    {
      label: "Students - Same School",
      icon: <ClipboardCheck size={28} />,
      value: universityStats?.totalSameSchool ?? "—",
      description: "Same school",
    },
    {
      label: "Students - Other School",
      icon: <University size={28} />,
      value: universityStats?.totalOtherSchool ?? "—",
      description: "Other schools",
    },
    {
      label: "Students - New School",
      icon: <GraduationCap size={28} />,
      value: universityStats?.totalNewSchool ?? "—",
      description: "New students",
    },
    {
      label: "Top 5 Courses",
      icon: <BookOpen size={28} />,
      value: topCourses.join("\n") || "—",
      description: "This month",
      multiline: true,
    },
    {
      label: "Top 3 Competitor Schools",
      icon: <University size={28} />,
      value: topCompetitorSchools.join("\n") || "—",
      description: "Competitors",
      multiline: true,
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Dashboard Overview</h2>
        <Button color="blue" onClick={handleSharePost}>
          Share University Link
        </Button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card, i) => (
          <div
            key={i}
            className={cardClass + (card.onClick ? " cursor-pointer" : "")}
            onClick={card.onClick}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full">{card.icon}</div>
              <span>{card.label}</span>
            </div>

            <div
              className={`font-bold whitespace-pre-line ${
                card.isUppercase ? "uppercase" : ""
              }`}
            >
              {card.value}
            </div>

            <div className="text-xs text-gray-500">{card.description}</div>
            {card.extraDesc && (
              <div className="text-xs italic text-gray-400">{card.extraDesc}</div>
            )}
          </div>
        ))}
      </div>

      {/* EDIT UNIVERSITY MODAL */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalHeader>Edit University Information</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* UNIVERSITY NAME */}
            <div>
              <Label htmlFor="universityName">University Name</Label>
              <TextInput
                id="universityName"
                value={newUniversityName}
                onChange={(e) => setNewUniversityName(e.target.value)}
              />
            </div>

            {/* DOMAIN EMAIL */}
            <div>
              <Label htmlFor="domainEmail">Domain Email</Label>
              <TextInput
                id="domainEmail"
                value={newDomainEmail}
                onChange={(e) => setNewDomainEmail(e.target.value)}
              />
            </div>

            {/* CHANGE PASSWORD CHECKBOX */}
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="changePassword"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
              />
              <Label htmlFor="changePassword" className="cursor-pointer">
                Change your password
              </Label>
            </div>

            {/* PASSWORD FIELDS */}
            {changePassword && (
              <div className="flex flex-col gap-4 mt-1">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <TextInput
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <TextInput
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="blue"
            onClick={handleSaveUniversityInfo}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
