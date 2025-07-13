import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  ServerCog,
} from "lucide-react";
import DashboardTable from "../../layout/dashboard/DashboardTableLayout.tsx";

export default function Dashboard() {
  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition bg-white border border-orange-200";

  const labelClass = "text-sm text-[#D94022] font-semibold";
  const valueClass = "text-4xl font-bold text-gray-800";
  const descClass = "text-xs text-gray-500";

  return (
    <div className="p-4 flex flex-col gap-8">
      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Students */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-100 text-[#D94022]">
              <GraduationCap size={28} />
            </div>
            <span className={labelClass}>Total Students</span>
          </div>
          <div className={valueClass}>1,234</div>
          <div className={descClass}>Updated 1 min ago</div>
        </div>

        {/* Card 2: Active Courses */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-100 text-[#D94022]">
              <BookOpen size={28} />
            </div>
            <span className={labelClass}>Active Courses</span>
          </div>
          <div className={valueClass}>26</div>
          <div className={descClass}>Live courses currently running</div>
        </div>

        {/* Card 3: Assessments Completed */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-100 text-[#D94022]">
              <ClipboardCheck size={28} />
            </div>
            <span className={labelClass}>Assessments Completed</span>
          </div>
          <div className={valueClass}>430</div>
          <div className={descClass}>Since last month</div>
        </div>

        {/* Card 4: System Update */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-100 text-[#D94022]">
              <ServerCog size={28} />
            </div>
            <span className={labelClass}>System Update</span>
          </div>
          <div className={valueClass}>99.95%</div>
          <div className={descClass}>Last 28 days</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Table Section */}
      <div className="p-2">
        <DashboardTable />
      </div>
    </div>
  );
}
