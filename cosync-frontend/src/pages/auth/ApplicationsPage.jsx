import { useState } from "react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS = [
  {
    id: 1, title: "Campus Rideshare App", category: "Mobile / Web",
    author: "Hammad Ajmal", authorAvatar: "#a78bfa",
    role: "React Native Developer", appliedDate: "Apr 23, 2026",
    status: "Pending", message: "I have 2 years of React Native experience and have built 3 production apps. I'm passionate about solving real campus problems.",
    stack: ["React Native", "Node.js", "MongoDB"],
    deadline: "May 15", applicants: 12,
    timeline: [
      { event: "Application submitted", time: "Apr 23, 10:30 AM", done: true },
      { event: "Under review", time: "Apr 24, 2:00 PM", done: true },
      { event: "Decision pending", time: "Expected May 1", done: false },
    ],
  },
  {
    id: 2, title: "E-Sports Tournament Platform", category: "Web App",
    author: "Umar Farooq", authorAvatar: "#4ade80",
    role: "Backend Developer", appliedDate: "Apr 20, 2026",
    status: "Accepted", message: "I specialize in Node.js and have built real-time systems before. Excited about the WebSocket architecture for live score updates.",
    stack: ["Node.js", "MongoDB", "WebSockets"],
    deadline: "May 12", applicants: 15,
    timeline: [
      { event: "Application submitted", time: "Apr 20, 9:00 AM", done: true },
      { event: "Under review", time: "Apr 21, 11:00 AM", done: true },
      { event: "Accepted! 🎉", time: "Apr 22, 3:30 PM", done: true },
    ],
  },
  {
    id: 3, title: "Blockchain Voting System", category: "Blockchain",
    author: "Bilal Ahmed", authorAvatar: "#61dafb",
    role: "React Developer", appliedDate: "Apr 18, 2026",
    status: "Declined", message: "I'm interested in blockchain tech and have been learning Solidity. My React skills are strong and I can handle the frontend.",
    stack: ["React", "Solidity", "Ethers.js"],
    deadline: "May 22", applicants: 4,
    timeline: [
      { event: "Application submitted", time: "Apr 18, 4:00 PM", done: true },
      { event: "Under review", time: "Apr 19, 10:00 AM", done: true },
      { event: "Not selected", time: "Apr 21, 5:00 PM", done: true },
    ],
  },
  {
    id: 4, title: "Mental Health Chatbot", category: "AI / ML",
    author: "Fatima Malik", authorAvatar: "#fb923c",
    role: "React Developer", appliedDate: "Apr 25, 2026",
    status: "Pending", message: "This project really resonates with me. I have strong React skills and experience building chat interfaces.",
    stack: ["React", "Node.js", "GPT-4 API"],
    deadline: "May 18", applicants: 6,
    timeline: [
      { event: "Application submitted", time: "Apr 25, 8:00 AM", done: true },
      { event: "Under review", time: "Pending", done: false },
      { event: "Decision", time: "Expected May 3", done: false },
    ],
  },
];

const STATUS_CONFIG = {
  Pending:  { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  icon: "⏳" },
  Accepted: { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)",  icon: "✓" },
  Declined: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", icon: "✕" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.icon} {status}
    </span>
  );
};

// ── Detail modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ app, onClose }) => {
  const s = STATUS_CONFIG[app.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}>
      <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl"
        style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)", animation: "modalIn 0.25s ease both" }}
        onClick={e => e.stopPropagation()}>

        {/* Status banner */}
        <div className="p-1 rounded-t-2xl" style={{ background: s.bg }}>
          <div className="flex items-center justify-center gap-2 py-2">
            <span style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
            <span className="text-sm font-semibold" style={{ color: s.color }}>
              Application {app.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Project info */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{app.title}</h3>
              <p className="text-sm" style={{ color: "#a78bfa" }}>{app.role}</p>
              <p className="text-xs mt-1" style={{ color: "#4b5563" }}>by {app.author} · Applied {app.appliedDate}</p>
            </div>
            <button onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 22 }}>×</button>
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {app.stack.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa" }}>{s}</span>
            ))}
          </div>

          {/* Message */}
          <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#4b5563" }}>Your application message</p>
            <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>"{app.message}"</p>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4b5563" }}>Application timeline</p>
            <div className="space-y-0">
              {app.timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        background: t.done ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.06)",
                        border: `1px solid ${t.done ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`,
                        color: t.done ? "#a78bfa" : "#374151",
                      }}>
                      {t.done ? "✓" : "·"}
                    </div>
                    {i < app.timeline.length - 1 && (
                      <div className="w-px flex-1 my-1" style={{ background: t.done ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.08)", minHeight: 20 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium" style={{ color: t.done ? "#fff" : "#374151" }}>{t.event}</p>
                    <p className="text-xs" style={{ color: "#4b5563" }}>{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Declined feedback */}
          {app.status === "Declined" && (
            <div className="rounded-xl p-4 mt-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#f87171" }}>Not selected this time</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>Don't be discouraged — keep building and applying. Your profile is still visible to all project leads.</p>
            </div>
          )}

          {app.status === "Accepted" && (
            <div className="rounded-xl p-4 mt-2" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#4ade80" }}>🎉 You're on the team!</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>Your workspace has been unlocked. Head to your dashboard to access the team Kanban board and discussion.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Application Card ──────────────────────────────────────────────────────────
const AppCard = ({ app, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const s = STATUS_CONFIG[app.status];

  return (
    <div
      className="rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer"
      style={{
        background: hovered ? "rgba(20,12,50,0.95)" : "rgba(12,8,32,0.85)",
        borderColor: hovered ? s.border : "rgba(139,92,246,0.12)",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.3)` : "none",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(app)}
    >
      {/* Status strip */}
      <div className="h-0.5" style={{ background: s.bg }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ background: app.authorAvatar + "20", color: app.authorAvatar, border: `1px solid ${app.authorAvatar}30` }}>
              {app.title[0]}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{app.title}</h3>
              <p className="text-xs" style={{ color: "#4b5563" }}>{app.category} · by {app.author}</p>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="rounded-lg px-3 py-2 mb-3" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
          <p className="text-xs" style={{ color: "#6b7280" }}>Applied as</p>
          <p className="text-sm font-medium" style={{ color: "#a78bfa" }}>{app.role}</p>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {app.stack.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.04)", color: "#4b5563", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs" style={{ color: "#374151" }}>
          <span>Applied {app.appliedDate}</span>
          <span style={{ color: "#a78bfa" }}>View details →</span>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ApplicationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const FILTERS = ["All", "Pending", "Accepted", "Declined"];
  const filtered = APPLICATIONS.filter(a => filter === "All" || a.status === filter);

  const counts = {
    Pending: APPLICATIONS.filter(a => a.status === "Pending").length,
    Accepted: APPLICATIONS.filter(a => a.status === "Accepted").length,
    Declined: APPLICATIONS.filter(a => a.status === "Declined").length,
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .filter-btn { padding:6px 14px; border-radius:8px; font-size:0.78rem; font-weight:500; cursor:pointer; transition:all 0.2s; border:none; font-family:inherit; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#05030f", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#fff" }}>

        {/* Navbar */}
        <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5"
          style={{ background: "rgba(5,3,15,0.92)", borderBottom: "1px solid rgba(139,92,246,0.08)", backdropFilter: "blur(20px)", animation: "slideDown 0.4s ease both" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>C</div>
              <span className="font-semibold text-white">CoSync</span>
            </button>
            <span style={{ color: "#374151" }}>›</span>
            <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>Applications</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ background: "none", border: "1px solid rgba(139,92,246,0.15)", color: "#6b7280", cursor: "pointer" }}>
              ← Dashboard
            </button>
            <button onClick={() => navigate("/feed")}
              className="text-sm px-4 py-1.5 rounded-lg font-semibold"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
              Browse Projects
            </button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8" style={{ animation: "fadeUp 0.5s ease both" }}>
            <h1 className="text-3xl font-bold mb-2" style={{ letterSpacing: "-0.025em" }}>My Applications</h1>
            <p style={{ color: "#4b5563" }}>Track the status of every project you've applied to.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8" style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.1s" }}>
            {[
              { label: "Pending", value: counts.Pending, color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
              { label: "Accepted", value: counts.Accepted, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
              { label: "Declined", value: counts.Declined, color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-5 text-center"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6" style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.15s" }}>
            {FILTERS.map(f => (
              <button key={f} className="filter-btn" onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "rgba(124,58,237,0.18)" : "rgba(12,8,32,0.85)",
                  border: `1px solid ${filter === f ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`,
                  color: filter === f ? "#a78bfa" : "#4b5563",
                }}>
                {f} {f !== "All" && `(${counts[f] || 0})`}
              </button>
            ))}
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((a, i) => <AppCard key={a.id} app={a} index={i} onClick={setSelected} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)" }}>
                <span style={{ fontSize: 24 }}>📨</span>
              </div>
              <h3 className="text-white font-semibold mb-2">No {filter !== "All" ? filter.toLowerCase() : ""} applications</h3>
              <p className="text-sm mb-5" style={{ color: "#374151" }}>Browse projects and apply to join a team</p>
              <button onClick={() => navigate("/feed")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
                Browse Projects
              </button>
            </div>
          )}
        </div>
      </div>

      {selected && <DetailModal app={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default ApplicationsPage;