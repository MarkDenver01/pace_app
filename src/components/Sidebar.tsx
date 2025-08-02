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
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; 

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AppSidebar({ collapsed, setCollapsed }: Props) {
  const { role, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const { themeName } = useThemeContext();

  const sidebarMenu: SidebarMenuSection[] =
    role === "ADMIN" ? adminSidebarMenu : 
    role === "SUPER_ADMIN" ? superAdminSidebarMenu :
    []

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
    } ${active ? "sidebar-active" : "sidebar-hover border-transparent"}`;

  return (
    <motion.div
      animate={{ width: collapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full z-40 overflow-hidden flex flex-col rounded-r-[25px] sidebar-theme"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer border-b"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <img
            className="h-8 w-8 rounded bg-white"
            src={localStorage.getItem("customLogo") || pace_logo}
            alt="Logo"
          />
          {!collapsed && (
            <span className="text-xl font-semibold">
              Pace Admin
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-4 space-y-6">
          {sidebarMenu.map((section) => (
            <div key={section.section} className="group transition-all">
              {!collapsed && (
                <div className="px-4 py-1 text-xs font-bold uppercase tracking-wide opacity-70">
                  {section.section}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isDropdownOpen = open[item.label];
                  const active = isItemActive(item);

                  return (
                    <div key={item.label} className="relative group">
                      {item.children ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.label)}
                            className={menuClass(false)}
                          >
                            <item.icon size={18} />
                            {!collapsed && (
                              <span className="flex-1">{item.label}</span>
                            )}
                            {!collapsed && (
                              <RotateIcon rotate={isDropdownOpen} />
                            )}
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
                          className={menuClass(active)}
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

      {/* Current Theme */}
      <div className="px-4 py-2 text-xs uppercase font-semibold opacity-70 border-t border-[var(--sidebar-border)]">
        {collapsed ? (
          <span title={`Theme: ${themeName}`}>🎨</span>
        ) : (
          <span>
            Theme: {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </span>
        )}
      </div>

      {/*  Logout */}
      <div className="border-t p-3">
        <button
          onClick={() => {
            const confirmLogout = confirm("Are you sure you want to logout?");
            if (confirmLogout) {
              logout(); // clean logout from context
            }
          }}
          className="w-full flex items-center gap-3 transition-all duration-200 px-4 py-2 rounded-md hover:bg-[var(--sidebar-hover-bg)]"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
