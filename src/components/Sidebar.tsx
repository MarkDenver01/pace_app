import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  adminSidebarMenu,
  superAdminSidebarMenu,
} from "../hooks/sidebar_menu";
import type { SidebarMenuItem, SidebarMenuSection } from "../types/sidebar";
import pace_logo from "../assets/logo_pace.svg";
import RotateIcon from "../components/sidebar/RotateIcon";
import SidebarDropdown from "../components/sidebar/SidebarDropdown";
import { LogOut } from "lucide-react";

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  role: "admin" | "superadmin";
}

export default function AppSidebar({ collapsed, setCollapsed, role }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const sidebarMenu: SidebarMenuSection[] =
    role === "admin" ? adminSidebarMenu : superAdminSidebarMenu;

  useEffect(() => {
    const expanded: Record<string, boolean> = {};
    sidebarMenu.forEach((section) => {
      section.items.forEach((item) => {
        if (
          item.children?.some((child) =>
            location.pathname.startsWith(child.path!)
          )
        ) {
          expanded[item.label] = true;
        }
      });
    });
    setOpen(expanded);
  }, [location.pathname, sidebarMenu]);

  const toggleDropdown = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isItemActive = (item: SidebarMenuItem): boolean =>
    item.path === location.pathname ||
    !!item.children?.some((child) => location.pathname === child.path);

  const menuClass = (active: boolean) =>
    `group relative flex items-center gap-3 w-full text-left border-l-4 transition-all duration-200 ${
      collapsed ? "px-2 py-1.5" : "px-4 py-2"
    } ${
      active
        ? "bg-white/10 font-semibold border-white/50"
        : "border-transparent hover:bg-[#e85638] hover:border-white/30"
    }`;

  return (
    <motion.div
      animate={{ width: collapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full bg-[#D94022] text-white border-r border-[#b93218] z-40 overflow-hidden flex flex-col rounded-r-[25px]"
    >
      {/* Header */}
      <div
        className="bg-[#C2371D] flex items-center justify-between px-4 py-4 cursor-pointer border-b border-[#b93218]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <img className="h-8 w-8" src={pace_logo} alt="Logo" />
          {!collapsed && <span className="text-xl font-semibold">Pace Admin</span>}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto bg-[#D94022]">
        <nav className="py-4 space-y-6">
          {sidebarMenu.map((section) => (
            <div key={section.section} className="group transition-all">
              {!collapsed && (
                <div className="px-4 py-1 text-xs font-bold text-orange-100 uppercase tracking-wide">
                  {section.section}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  isItemActive(item);
                  const isDropdownOpen = open[item.label];

                  return (
                    <div key={item.label} className="relative group">
                      {item.children ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.label)}
                            className={menuClass(false)}
                          >
                            <item.icon size={18} />
                            {!collapsed && <span className="flex-1">{item.label}</span>}
                            {!collapsed && <RotateIcon rotate={isDropdownOpen} />}
                          </button>
                          <SidebarDropdown
                            parent={item}
                            collapsed={collapsed}
                            isOpen={isDropdownOpen}
                          />
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(item.path!)}
                          title={collapsed ? item.label : ""}
                          className={menuClass(isItemActive(item))}
                        >
                          <item.icon size={18} />
                          {!collapsed && <span>{item.label}</span>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="bg-[#C2371D] border-t border-[#b93218] p-3">
        <button
          onClick={() => {
            const confirmLogout = confirm("Are you sure you want to logout?");
            if (confirmLogout) {
              localStorage.removeItem("user");
              navigate("/");
            }
          }}
          className="w-full flex items-center gap-3 text-white hover:bg-[#e85638] transition-all duration-200 px-4 py-2 rounded-md"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
