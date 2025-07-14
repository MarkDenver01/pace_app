import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  ServerCog,
} from "lucide-react";
import DashboardTable from "./DashboardDataTable.tsx";

export default function Dashboard() {
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
    color: "var(--muted-text-color, #6b7280)", // fallback to gray-500
  };

  return (
    <div className="p-4 flex flex-col gap-8">
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
            1,234
          </div>
          <div className="text-xs" style={descStyle}>
            Updated 1 min ago
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
            26
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

        {/* Card 4: System Update */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <ServerCog size={28} />
            </div>
            <span className="text-sm font-semibold" style={labelStyle}>
              System Update
            </span>
          </div>
          <div className="text-4xl font-bold" style={valueStyle}>
            99.95%
          </div>
          <div className="text-xs" style={descStyle}>
            Last 28 days
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
