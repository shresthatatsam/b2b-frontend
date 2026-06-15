
const STATS = [
  { label: "Total Users", value: "12,430", change: "+8.2%", up: true },
  { label: "Revenue", value: "$48,295", change: "+14.5%", up: true },
  { label: "Active Projects", value: "34", change: "-2.1%", up: false },
  { label: "Completion Rate", value: "91%", change: "+3.7%", up: true },
];

const RECENT_ACTIVITY = [
  { user: "Alice Johnson", action: "Completed project Alpha", time: "2m ago", avatar: "AJ" },
  { user: "Ben Carter", action: "Uploaded new report", time: "15m ago", avatar: "BC" },
  { user: "Clara Diaz", action: "Joined the team", time: "1h ago", avatar: "CD" },
  { user: "David Kim", action: "Submitted invoice #204", time: "3h ago", avatar: "DK" },
  { user: "Eva Lin", action: "Closed support ticket #88", time: "5h ago", avatar: "EL" },
];

const QUICK_ACTIONS = [
  { label: "New Project", icon: "＋" },
  { label: "Upload File", icon: "↑" },
  { label: "Invite Member", icon: "✦" },
  { label: "View Reports", icon: "▤" },
];

const PROJECTS = [
  { name: "Alpha Launch", pct: 78 },
  { name: "Beta Testing", pct: 45 },
  { name: "Design System", pct: 92 },
];

export default function Overview() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || { name: "there" };
    } catch {
      return { name: "there" };
    }
  })();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* Greeting */}
      <div className="greeting">
        <p className="greeting-sub">{greeting},</p>
        <h2 className="greeting-name">{user.name} 👋</h2>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
            <span className={`stat-change ${s.up ? "up" : "down"}`}>
              {s.up ? "▲" : "▼"} {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="two-col">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="see-all">See all</button>
          </div>
          <ul className="activity-list">
            {RECENT_ACTIVITY.map((item, i) => (
              <li key={i} className="activity-item">
                <div className="avatar-sm activity-avatar">{item.avatar}</div>
                <div className="activity-text">
                  <span className="activity-user">{item.user}</span>
                  <span className="activity-action">{item.action}</span>
                </div>
                <span className="activity-time">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions + Progress */}
        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <button key={action.label} className="action-btn">
                <span className="action-icon">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          <div className="progress-section">
            <p className="progress-title">Project Completion</p>
            {PROJECTS.map((p) => (
              <div key={p.name} className="progress-item">
                <div className="progress-meta">
                  <span>{p.name}</span>
                  <span>{p.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}