import { useState, useEffect, useMemo } from "react";
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

import {
  getCourseCountsByUniversity,
  getDailyAssessments,
  getDailySameSchoolCount,
  getDailyOtherSchoolCount,
  getDailyNewSchoolCount,
  getCompetitorCounts,
} from "../../../libs/ApiResponseService";

interface CourseData {
  course: string;
  engagement: number;
}

interface DailyData {
  date: string;
  count: number;
}

interface CompetitorData {
  universityName: string;
  date: string;
  count: number;
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
  const [dailyAssessments, setDailyAssessments] = useState<DailyData[]>([]);
  const [sameSchoolCounts, setSameSchoolCounts] = useState<DailyData[]>([]);
  const [otherSchoolCounts, setOtherSchoolCounts] = useState<DailyData[]>([]);
  const [newSchoolCounts, setNewSchoolCounts] = useState<DailyData[]>([]);
  const [competitorCounts, setCompetitorCounts] = useState<CompetitorData[]>([]);

  const universityId = localStorage.getItem("authorized_university_id");

  // Fetch all analytics
  useEffect(() => {
    if (!universityId) return;

    const fetchAllAnalytics = async () => {
      try {
        const [
          courses,
          assessments,
          sameSchool,
          otherSchool,
          newSchool,
          competitors,
        ] = await Promise.all([
          getCourseCountsByUniversity(Number(universityId)),
          getDailyAssessments(Number(universityId)),
          getDailySameSchoolCount(Number(universityId)),
          getDailyOtherSchoolCount(Number(universityId)),
          getDailyNewSchoolCount(Number(universityId)),
          getCompetitorCounts(Number(universityId)),
        ]);

        setCourseData(courses.map(item => ({
          course: item.courseDescription,
          engagement: item.total,
        })));
        setDailyAssessments(assessments.map(item => ({ date: item.date, count: item.count })));
        setSameSchoolCounts(sameSchool.map(item => ({ date: item.date, count: item.count })));
        setOtherSchoolCounts(otherSchool.map(item => ({ date: item.date, count: item.count })));
        setNewSchoolCounts(newSchool.map(item => ({ date: item.date, count: item.count })));
        setCompetitorCounts(competitors);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    fetchAllAnalytics();
  }, [universityId]);

  // Filter courses by search
  const filteredCourseData = useMemo(() => {
    return courseData.filter(course =>
      course.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courseData, searchQuery]);

  const courseColors = useMemo(() => {
    const map: Record<string, string> = {};
    filteredCourseData.forEach((item, index) => {
      if (!map[item.course]) {
        map[item.course] = getRandomColor(index);
      }
    });
    return map;
  }, [filteredCourseData]);

  return (
    <div className="space-y-6">
      {/* Course Engagement Card */}
      <ChartCard
        title="Course Engagement Analytics"
        filteredData={filteredCourseData}
        dataKey="engagement"
        colorMap={courseColors}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Daily Assessments */}
      <ChartCard
        title="Daily Assessments"
        filteredData={dailyAssessments}
        dataKey="count"
      />

      {/* Same-School Counts */}
      <ChartCard
        title="Daily Same-School Count"
        filteredData={sameSchoolCounts}
        dataKey="count"
      />

      {/* Other-School Counts */}
      <ChartCard
        title="Daily Other-School Count"
        filteredData={otherSchoolCounts}
        dataKey="count"
      />

      {/* New-School Counts */}
      <ChartCard
        title="Daily New-School Count"
        filteredData={newSchoolCounts}
        dataKey="count"
      />

      {/* Competitor Counts */}
      <ChartCard
        title="Competitor University Counts"
        filteredData={competitorCounts}
        dataKey="count"
        xKey="universityName"
      />
    </div>
  );
}

// Reusable Chart Card
interface ChartCardProps {
  title: string;
  filteredData: any[];
  dataKey: string;
  xKey?: string; // optional, defaults to 'date' or 'course'
  colorMap?: Record<string, string>;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  dateFilter?: string;
  setDateFilter?: (val: string) => void;
}

function ChartCard({
  title,
  filteredData,
  dataKey,
  xKey,
  colorMap,
}: ChartCardProps) {
  if (!filteredData || filteredData.length === 0) return null;

  const xDataKey = xKey || (filteredData[0]?.course ? "course" : "date");

  return (
    <div className="p-6 rounded-xl shadow-md border card-theme" style={{ backgroundColor: "var(--card-color)" }}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5" style={{ color: "var(--button-color)" }} />
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
          {title}
        </h2>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--divider-color)" />
            <XAxis dataKey={xDataKey} stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" domain={[0, (dataMax: number) => dataMax + 20]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-color)",
                border: "1px solid var(--divider-color)",
                color: "var(--text-color)",
              }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
              {filteredData.map((entry, index) => (
                <Cell key={index} fill={colorMap?.[entry[xDataKey]] || getRandomColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

