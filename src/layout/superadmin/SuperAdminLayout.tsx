import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import AppSidebar from '../../components/Sidebar.tsx';
import SuperAdminDashboard from "../../page/superadmin/dashboard/SuperDashboard.tsx";
import SuperRecordsPage from "../../page/superadmin/records/SuperRecordsPage.tsx";
import SuperAdminViewRecords from "../../page/superadmin/records/SuperViewRecords.tsx";
import CourseTableLayout from "../../page/superadmin/courses/SuperCourseManagement.tsx";
import StatementQuestionPage from "../../page/superadmin/questions/SuperQuestions.tsx";


export default function SuperAdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-200">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="p-4 overflow-y-auto flex-1">
          <Routes>
            {/* Only define relative routes here */}
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="records" element={<SuperRecordsPage/>} />
            <Route path="records/view" element={<SuperAdminViewRecords />} />
            <Route path="courses" element={<CourseTableLayout/>} />
            <Route path="questions" element={<StatementQuestionPage/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
