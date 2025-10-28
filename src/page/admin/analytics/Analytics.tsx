import { useState, useMemo, useEffect } from "react";
import { CalendarDays, Search, BarChart3 } from "lucide-react";
import { TextInput } from "flowbite-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { getCourseCountsByUniversity } from "../../../libs/ApiResponseService"; // <-- import your API

interface CourseData {
  course: string;
  engagement: number;
}

function getRandomColor(index: number): string {
  const palette = [
    "#3B82F6", "#10B981", "#DB2777", "#7F1D1D", "#14B8A6",
    "#8B5CF6", "#F59E0B", "#EC4899", "#6366F1", "#84CC16",
  ];
  return palette[index % palette.length];
}

export default function AnalyticsPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseData, setCourseData] = useState<CourseData[]>([]);

  const universityId = localStorage.getItem("authorized_university_id");

  // Fetch backend data
  useEffect(() => {
    if (!universityId) return;

    const fetchCourses = async () => {
      try {
        const data = await getCourseCountsByUniversity(Number(universityId));
        const mappedData: CourseData[] = data.map((item) => ({
          course: item.courseDescription,
          engagement: item.total,
        }));
        setCourseData(mappedData);
      } catch (error) {
        console.error("Failed to fetch course analytics:", error);
      }
    };

    fetchCourses();
  }, [universityId]);

  // Filter by search query
  const filteredData = useMemo(() => {
    return courseData.filter((course) =>
      course.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courseData, searchQuery]);

  const courseColors = useMemo(() => {
    const map: Record<string, string> = {};
    filteredData.forEach((item, index) => {
      if (!map[item.course]) {
        map[item.course] = getRandomColor(index);
      }
    });
    return map;
  }, [filteredData]);

  return (
    <div
      className="p-6 rounded-xl shadow-md border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5" style={{ color: "var(--button-color)" }} />
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
          Course Engagement Analytics
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:max-w-xs">
          <CalendarDays className="w-5 h-5" style={{ color: "var(--muted-text-color)" }} />
          <TextInput
            type="text"
            placeholder="Filter by date (mm/dd/yyyy)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:max-w-sm">
          <Search className="w-5 h-5" style={{ color: "var(--muted-text-color)" }} />
          <TextInput
            type="text"
            placeholder="Search course"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Title */}
      <div
        className="text-center font-medium mb-4"
        style={{ color: "var(--muted-text-color)" }}
      >
        Course Engagement Analytics
      </div>

      {/* Chart Section */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--divider-color)" />
            <XAxis dataKey="course" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" domain={[0, "dataMax + 20"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-color)",
                border: "1px solid var(--divider-color)",
                color: "var(--text-color)",
              }}
            />
            <Bar dataKey="engagement" radius={[4, 4, 0, 0]}>
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={courseColors[entry.course]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
