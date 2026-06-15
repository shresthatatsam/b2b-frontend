import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Overview from "./views/Overview";
import Products from "../Product/Product";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: "⊞" },
  { key: "analytics", label: "Analytics", icon: "▦" },
  { key: "projects", label: "Projects", icon: "◫" },
  { key: "messages", label: "Messages", icon: "✉" },
  { key: "products", label: "Products", icon: "◈" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

const VIEWS = {
  overview: <Overview />,
  products: <Products />,
  analytics: <div className="coming-soon">📊 Analytics coming soon</div>,
  projects: <div className="coming-soon">◫ Projects coming soon</div>,
  messages: <div className="coming-soon">✉ Messages coming soon</div>,
  settings: <div className="coming-soon">⚙ Settings coming soon</div>,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || { name: "User" };
    } catch {
      return { name: "User" };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo-mark">▲</div>
          {sidebarOpen && <span className="logo-text">B2B</span>}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeNav === item.key ? "active" : ""}`}
              onClick={() => setActiveNav(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="avatar-sm">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {sidebarOpen && (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">Member</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            ⇥
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-wrapper">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="toggle-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="page-title">
              {NAV_ITEMS.find((n) => n.key === activeNav)?.label}
            </h1>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" aria-label="Notifications">🔔</button>
            <div className="avatar-md">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* CONTENT — renders active view */}
        <main className="content">
          {VIEWS[activeNav]}
        </main>
      </div>
    </div>
  );
}