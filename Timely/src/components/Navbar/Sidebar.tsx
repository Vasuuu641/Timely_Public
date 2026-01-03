// Sidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import {LayoutDashboard,NotebookPen,SquareCheckBig,Calendar,TimerReset,Brain,Star,LogOut,Timer,} from "lucide-react";
import './Sidebar.css';
import { getInitials } from "../../utils/initial";

// Make path optional now
type NavItem = {
  label: string;
  path?: string; // optional for buttons like Logout
  icon: ReactNode;
  onClick?: () => void;
};

type SidebarProps = {
  items?: NavItem[];
  userEmail?: string;
};

// Primary sidebar items
const primaryItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Notes", path: "/notes", icon: <NotebookPen size={20} /> },
  { label: "Todo", path: "/todo", icon: <SquareCheckBig size={20} /> },
  { label: "Schedule", path: "/schedule", icon: <Calendar size={20} /> },
  { label: "Pomodoro", path: "/pomodoro", icon: <TimerReset size={20} /> },
  { label: "Quiz", path: "/quiz", icon: <Brain size={20} /> },
  { label: "Daily Review", path: "/review", icon: <Star size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ items = primaryItems, userEmail }) => {
  const navigate = useNavigate();

  // Secondary items like Logout
  const secondaryItems: NavItem[] = [
    {
      label: "Logout",
      icon: <LogOut size={20} />,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login"); // this works because useNavigate is inside the component
      },
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Timer size={32} />
          <h2>Timely</h2>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Primary navigation */}
      <nav className="sidebar-nav">
        {items.map((item) =>
          item.path ? (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          ) : null
        )}
      </nav>

      <div className="sidebar-spacer" />
      <div className="sidebar-divider secondary" />

      {/* User badge */}
      {userEmail && (
        <div className="sidebar-user">
          <div className="user-avatar">{getInitials(userEmail)}</div>
          <span className="user-email">{userEmail}</span>
        </div>
      )}

      {/* Secondary navigation (Logout) */}
      <nav className="sidebar-nav secondary">
        {secondaryItems.map((item) =>
          item.onClick ? (
            <button
              key={item.label}
              className="sidebar-link button-link"
              onClick={item.onClick}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ) : (
            item.path && (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            )
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
