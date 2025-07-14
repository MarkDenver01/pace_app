import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import AppSidebar from '../../components/Sidebar.tsx';

import Dashboard from '../../page/admin/dashboard/Dashboard.tsx';
import StudentAccountMonitoring from "../../page/admin/user-approval/StudentAccountMonitoring.tsx";
import CourseManagement from "../../page/admin/courses/CourseManagement.tsx";
import ReportPage from "../../page/admin/reports/ReportPage.tsx";
import AnalyticsPage from "../../page/admin/analytics/Analytics.tsx";
import Customization from "../../page/admin/customization/Customization.tsx";


export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-200">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} role="admin" />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="p-4 overflow-y-auto flex-1">
          <Routes>
            {/* Only define relative routes here */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-approval" element={<StudentAccountMonitoring />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="reports" element={<ReportPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="customization" element={<Customization/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
