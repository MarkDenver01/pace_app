// sidebar_menu.ts
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileBarChart2,
  Settings,
  FolderArchive,
  ClipboardList,
} from "lucide-react";
import type { SidebarMenuSection } from "../types/sidebar";

// Admin Menu
export const adminSidebarMenu: SidebarMenuSection[] = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard Overview",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
    ],
  },
  {
    section: "User Management",
    items: [
      {
        label: "User Approval",
        icon: Users,
        path: "/admin/user-approval",
      },
    ],
  },
  {
    section: "Courses",
    items: [
      {
        label: "Course Management",
        icon: BookOpen,
        path: "/admin/courses",
      },
    ],
  },
  {
    section: "Reports",
    items: [
      {
        label: "Report",
        icon: FileBarChart2,
        path: "/admin/reports",
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        label: "Analytics",
        icon: FileBarChart2,
        path: "/admin/analytics",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        label: "Customization",
        icon: Settings,
        path: "/admin/customization",
      },
    ],
  },
];

// Super Admin Menu
export const superAdminSidebarMenu: SidebarMenuSection[] = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard Overview",
        icon: LayoutDashboard,
        path: "/superadmin/dashboard",
      },
    ],
  },
  {
    section: "Records",
    items: [
      {
        label: "Records",
        icon: FolderArchive,
        path: "/superadmin/records",
      },
    ],
  },
  {
    section: "Courses",
    items: [
      {
        label: "Course Management",
        icon: BookOpen,
        path: "/superadmin/courses",
      },
    ],
  },
  {
    section: "Management",
    items: [
      {
        label: "Question & Statement",
        icon: ClipboardList,
        path: "/superadmin/questions",
      },
    ],
  },
];
