import { useState, useEffect, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BarChart3 } from "lucide-react";
import { Button } from "flowbite-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import {
  getTopCoursesByDateRange,
  getDailyAssessments,
  getDailySameSchoolCount,
  getDailyOtherSchoolCount,
  getDailyNewSchoolCount,
  getUniversityStats,
} from "../../../libs/ApiResponseService";

import { type UniversityStatsResponse } from "../../../libs/models/response/UniversityStats";
import { type TopCourseResponse } from "../../../libs/models/response/TopCourseResponse";

interface DailyData {
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
  const [topCourses, setTopCourses] = useState<TopCourseResponse[]>([]);
  const [dailyAssessments, setDailyAssessments] = useState<DailyData[]>([]);
  const [sameSchoolCounts, setSameSchoolCounts] = useState<DailyData[]>([]);
  const [otherSchoolCounts, setOtherSchoolCounts] = useState<DailyData[]>([]);
  const [newSchoolCounts, setNewSchoolCounts] = useState<DailyData[]>([]);
  const [universityStats, setUniversityStats] =
    useState<UniversityStatsResponse | null>(null);

  const universityId = localStorage.getItem("authorized_university_id");

  // ✅ Auto-refresh when month changes
  const currentMonthKey = new Date().getMonth();
  useEffect(() => {
    if (!universityId) return;

    const fetchAllAnalytics = async () => {
      try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        const [
          topCoursesRes,
          assessments,
          sameSchool,
          otherSchool,
          newSchool,
          stats,
        ] = await Promise.all([
          getTopCoursesByDateRange(Number(universityId), firstDay, lastDay),
          getDailyAssessments(Number(universityId)),
          getDailySameSchoolCount(Number(universityId)),
          getDailyOtherSchoolCount(Number(universityId)),
          getDailyNewSchoolCount(Number(universityId)),
          getUniversityStats(Number(universityId)),
        ]);

        setTopCourses(topCoursesRes);
        setDailyAssessments(
          assessments.map((item) => ({ date: item.date, count: item.count }))
        );
        setSameSchoolCounts(
          sameSchool.map((item) => ({ date: item.date, count: item.count }))
        );
        setOtherSchoolCounts(
          otherSchool.map((item) => ({ date: item.date, count: item.count }))
        );
        setNewSchoolCounts(
          newSchool.map((item) => ({ date: item.date, count: item.count }))
        );
        setUniversityStats(stats);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    fetchAllAnalytics();
  }, [universityId, currentMonthKey]);

  // ✅ Generate color per course
  const courseColors = useMemo(() => {
    const map: Record<string, string> = {};
    topCourses.forEach((item, index) => {
      map[item.courseDescription] = getRandomColor(index);
    });
    return map;
  }, [topCourses]);

  // ✅ Pie Data
  const pieData = useMemo(() => {
    if (!universityStats) return [];
    return [
      { name: "Same School", value: universityStats.totalSameSchool },
      { name: "Other School", value: universityStats.totalOtherSchool },
      { name: "New School", value: universityStats.totalNewSchool },
    ];
  }, [universityStats]);

  const pieColors = ["#3B82F6", "#10B981", "#DB2777"];

  return (
    <div className="space-y-6">
      {/* ✅ Top 5 Courses */}
      <ChartCard
        title="Top 5 Courses"
        filteredData={topCourses.map((item) => ({
          course: item.courseDescription,
          total: item.totalCount,
        }))}
        dataKey="total"
        xKey="course"
        colorMap={courseColors}
      />

      {/* ✅ Overall Course Engagement Pie Chart */}
      <ChartCard
        title="Overall Course Engagement"
        filteredData={pieData}
        dataKey="value"
        chartType="pie"
        colorMap={{
          "Same School": pieColors[0],
          "Other School": pieColors[1],
          "New School": pieColors[2],
        }}
      />

      {/* ✅ Daily Assessments */}
      <ChartCard
        title="Daily Assessments (total students taking assessments)"
        filteredData={dailyAssessments}
        dataKey="count"
      />

      {/* ✅ Same-School Counts */}
      <ChartCard
        title="Daily Same-School (total students from same school)"
        filteredData={sameSchoolCounts}
        dataKey="count"
      />

      {/* ✅ Other-School Counts */}
      <ChartCard
        title="Daily Other-School Count (total students from other schools)"
        filteredData={otherSchoolCounts}
        dataKey="count"
      />

      {/* ✅ New-School Counts */}
      <ChartCard
        title="Daily New-School Count (total students from new schools)"
        filteredData={newSchoolCounts}
        dataKey="count"
      />
    </div>
  );
}

// 📊 Reusable Chart Card
interface ChartCardProps {
  title: string;
  filteredData: any[];
  dataKey: string;
  xKey?: string;
  colorMap?: Record<string, string>;
  chartType?: "bar" | "pie";
}

function ChartCard({
  title,
  filteredData,
  dataKey,
  xKey,
  colorMap,
  chartType = "bar",
}: ChartCardProps) {
  const xDataKey = xKey || (filteredData[0]?.course ? "course" : "date");
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.text(title, 20, 30);
    pdf.addImage(imgData, "PNG", 10, 40, canvas.width - 20, canvas.height - 60);
    pdf.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div
      className="p-6 rounded-xl shadow-md border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: "var(--button-color)" }} />
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
            {title}
          </h2>
        </div>

        <Button
          size="sm"
          color="gray"
          onClick={handleExportPDF}
          className="ml-auto flex items-center gap-2"
        >
          📄 Export PDF
        </Button>
      </div>

      <div ref={chartRef} className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--divider-color)" />
              <XAxis
                dataKey={xDataKey}
                stroke="var(--text-color)"
                interval={0}
                tick={{
                    fontSize: 11, // smaller font for long labels
                    fill: "var(--text-color)"
              }}
              tickLine={false}
              height={90}
              angle={-25}
              textAnchor="end"
            >
            </XAxis>
              <YAxis stroke="var(--text-color)" domain={[0, "dataMax + 20"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--divider-color)",
                  color: "var(--text-color)",
                }}
              />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMap?.[entry[xDataKey]] || getRandomColor(index)}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={filteredData}
                dataKey={dataKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMap?.[entry.name] || getRandomColor(index)}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--divider-color)",
                  color: "var(--text-color)",
                }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
