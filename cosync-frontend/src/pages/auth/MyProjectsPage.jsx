import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeProject } from "../../store/projectsSlice";

// ── Sample static projects (merged with Redux) ────────────────────────────────
const STATIC_PROJECTS = [
  {
    id: 101, title: "AI Chess Bot", category: "AI / ML", status: "Recruiting",
    description: "Building a chess engine powered by reinforcement learning. The bot will learn from millions of games and develop its own strategies.",
    roles: [{ label: "React Dev", color: "#61dafb" }, { label: "Python Dev", color: "#4ade80" }],
    stack: ["React", "Python", "PyTorch", "FastAPI"],
    applicants: 7, members: 2, progress: 20, posted: "2 days ago",
    deadline: "May 10", teamSize: "3 members", duration: "2–3 months",
    isRemote: true, isPublic: true,
    team: [
      { name: "Azaan Murtaza", role: "Lead", avatar: "#7c3aed" },
      { name: "Sara Q", role: "ML Dev", avatar: "#a78bfa" },
    ],
    appliedList: [
      { name: "Ali Hassan", role: "React Dev", time: "2h ago", status: "Pending", avatar: "#61dafb" },
      { name: "Bilal Ahmed", role: "Python Dev", time: "5h ago", status: "Pending", avatar: "#4ade80" },
      { name: "Fatima M", role: "React Dev", time: "1d ago", status: "Accepted", avatar: "#f472b6" },
    ],
  },
];

const STATUS_MAP = {
  Recruiting: { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.25)", dot: true },
  Active:     { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", dot: true },
  Completed:  { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)", dot: false },
  Paused:     { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)", dot: false },
};

const SKILL_COLORS = ["#61dafb","#a78bfa","#4ade80","#fb923c","#f472b6","#34d399","#60a5fa","#fbbf24"];

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.Recruiting;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />}
      {status}
    </span>
  );
};

// ── Applicant row ─────────────────────────────────────────────────────────────
const ApplicantRow = ({ a }) => {
  const [status, setStatus] = useState(a.status);
  return (
    <div className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid rgba(139,92,246,0.06)" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: a.avatar + "30", color: a.avatar, border: `1px solid ${a.avatar}40` }}>
          {a.name[0]}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{a.name}</p>
          <p className="text-xs" style={{ color: "#4b5563" }}>{a.role} · {a.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === "Pending" ? (
          <>
            <button onClick={() => setStatus("Accepted")}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
              style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", cursor: "pointer" }}>
              Accept
            </button>
            <button onClick={() => setStatus("Declined")}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", cursor: "pointer" }}>
              Decline
            </button>
          </>
        ) : (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: status === "Accepted" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.08)",
              color: status === "Accepted" ? "#4ade80" : "#f87171",
              border: `1px solid ${status === "Accepted" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.2)"}`,
            }}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Project detail panel ──────────────────────────────────────────────────────
const ProjectPanel = ({ project, onClose, onDelete }) => {
  const [tab, setTab] = useState("overview");
  const TABS = ["overview", "applicants", "team", "settings"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl"
        style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)", animation: "modalIn 0.25s ease both" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={project.status} />
                <span className="text-xs px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                  {project.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{project.title}</h2>
              <p className="text-sm mt-1" style={{ color: "#4b5563" }}>Posted {project.posted} · {project.applicants} applicants</p>
            </div>
            <button onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 22, lineHeight: 1 }}>×</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1" style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-2.5 text-sm font-medium capitalize transition-all duration-200"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: tab === t ? "#a78bfa" : "#4b5563",
                  borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
                  marginBottom: -1,
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview tab */}
          {tab === "overview" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>Description</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Duration", value: project.duration },
                  { label: "Team Size", value: project.teamSize },
                  { label: "Deadline", value: project.deadline },
                  { label: "Remote", value: project.isRemote ? "Yes" : "No" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3"
                    style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
                    <p className="text-xs mb-1" style={{ color: "#4b5563" }}>{label}</p>
                    <p className="text-sm font-medium text-white">{value || "—"}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s, i) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: `${SKILL_COLORS[i % SKILL_COLORS.length]}12`, border: `1px solid ${SKILL_COLORS[i % SKILL_COLORS.length]}30`, color: SKILL_COLORS[i % SKILL_COLORS.length] }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>Roles Needed</p>
                <div className="flex flex-wrap gap-2">
                  {project.roles.map(r => (
                    <span key={r.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: `${r.color}12`, border: `1px solid ${r.color}30`, color: r.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />{r.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>Progress</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
                    <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>{project.progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Applicants tab */}
          {tab === "applicants" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">{project.appliedList?.length || 0} applicants</p>
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
                  {project.appliedList?.filter(a => a.status === "Pending").length} pending review
                </span>
              </div>
              {project.appliedList?.length > 0 ? (
                project.appliedList.map((a, i) => <ApplicantRow key={i} a={a} />)
              ) : (
                <div className="text-center py-10">
                  <p className="text-white text-sm mb-1">No applicants yet</p>
                  <p className="text-xs" style={{ color: "#374151" }}>Share your project to attract collaborators</p>
                </div>
              )}
            </div>
          )}

          {/* Team tab */}
          {tab === "team" && (
            <div>
              <p className="text-sm font-semibold text-white mb-4">{project.team?.length || 0} members</p>
              <div className="space-y-3">
                {project.team?.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: m.avatar + "30", color: m.avatar, border: `1px solid ${m.avatar}40` }}>
                        {m.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.name}</p>
                        <p className="text-xs" style={{ color: "#4b5563" }}>{m.role}</p>
                      </div>
                    </div>
                    {i === 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                        Lead
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings tab */}
          {tab === "settings" && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}>
                {[
                  { label: "Mark as Active", desc: "Move project from recruiting to active development", color: "#a78bfa" },
                  { label: "Mark as Completed", desc: "Archive this project as successfully finished", color: "#4ade80" },
                  { label: "Pause Recruiting", desc: "Stop accepting new applications temporarily", color: "#fbbf24" },
                ].map(item => (
                  <button key={item.label}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left"
                    style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)"}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: item.color }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{item.desc}</p>
                    </div>
                    <span style={{ color: "#374151" }}>›</span>
                  </button>
                ))}
              </div>
              <button onClick={() => { onDelete(project.id); onClose(); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                🗑 Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, onManage, onDelete, onWorkspace, index }) => {
  const [hovered, setHovered] = useState(false);
  const fillPct = Math.round((project.members / parseInt(project.teamSize || "3")) * 100) || 33;

  return (
    <div
      className="rounded-2xl border relative overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        background: hovered ? "rgba(20,12,50,0.95)" : "rgba(12,8,32,0.85)",
        borderColor: hovered ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.12)",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 20px 50px rgba(109,40,217,0.2)" : "none",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-px transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent)", opacity: hovered ? 1 : 0 }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={project.status} />
              <span className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: "rgba(139,92,246,0.1)", color: "#6b7280", border: "1px solid rgba(139,92,246,0.15)" }}>
                {project.category}
              </span>
            </div>
            <h3 className="text-white font-bold text-base">{project.title}</h3>
            <p className="text-xs mt-0.5" style={{ color: "#374151" }}>Posted {project.posted}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>
          {project.description?.slice(0, 100)}...
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.roles?.map(r => (
            <span key={r.label} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
              style={{ background: `${r.color}12`, border: `1px solid ${r.color}30`, color: r.color }}>
              <span className="w-1 h-1 rounded-full" style={{ background: r.color }} />{r.label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.stack?.slice(0, 4).map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.04)", color: "#4b5563", border: "1px solid rgba(255,255,255,0.06)" }}>{s}</span>
          ))}
          {project.stack?.length > 4 && <span className="text-xs" style={{ color: "#374151" }}>+{project.stack.length - 4}</span>}
        </div>

        {/* Team fill */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs" style={{ color: "#374151" }}>Team filled</span>
            <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>{project.members}/{project.teamSize?.split(" ")[0] || "3"}</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Applicants", value: project.applicants || 0, color: "#a78bfa" },
            { label: "Progress", value: `${project.progress || 0}%`, color: "#4ade80" },
            { label: "Deadline", value: project.deadline || "—", color: "#60a5fa" },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl py-2"
              style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.08)" }}>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: "#374151" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-3" style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}>
          <button onClick={() => onWorkspace(project.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.35)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            ⊞ Open Workspace
          </button>
          <button onClick={() => onManage(project)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(139,92,246,0.08)"}>
            Manage
          </button>
          <button onClick={() => onDelete(project.id)}
            className="px-3 py-2 rounded-xl text-xs transition-all duration-200"
            style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.06)"}>
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MyProjectsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myProjects: reduxProjects } = useSelector(s => s.projects);
  const allProjects = [...STATIC_PROJECTS, ...reduxProjects];

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const FILTERS = ["All", "Recruiting", "Active", "Completed", "Paused"];

  const filtered = allProjects.filter(p => {
    const matchFilter = filter === "All" || p.status === filter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete = (id) => {
    dispatch(removeProject(id));
    setSelected(null);
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .filter-btn { padding:6px 14px; border-radius:8px; font-size:0.78rem; font-weight:500; cursor:pointer; transition:all 0.2s; border:none; white-space:nowrap; font-family:inherit; }
        .nav-link { color:#6b7280; font-size:0.875rem; text-decoration:none; transition:color 0.2s; }
        .nav-link:hover { color:#fff; }
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
            <span className="text-sm" style={{ color: "#a78bfa", fontWeight: 500 }}>My Projects</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="text-sm px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{ background: "none", border: "1px solid rgba(139,92,246,0.15)", color: "#6b7280", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.15)"; }}>
              ← Dashboard
            </button>
            <button onClick={() => navigate("/projects/create")}
              className="text-sm px-4 py-1.5 rounded-lg font-semibold"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
              + New Project
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8" style={{ animation: "fadeUp 0.5s ease both" }}>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ letterSpacing: "-0.025em" }}>My Projects</h1>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  Manage your projects, review applicants, and track progress.
                </p>
              </div>
              {/* Summary pills */}
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Total", value: allProjects.length, color: "#a78bfa" },
                  { label: "Recruiting", value: allProjects.filter(p => p.status === "Recruiting").length, color: "#4ade80" },
                  { label: "Active", value: allProjects.filter(p => p.status === "Active").length, color: "#60a5fa" },
                ].map(s => (
                  <div key={s.label} className="text-center px-4 py-2 rounded-xl"
                    style={{ background: "rgba(12,8,32,0.8)", border: "1px solid rgba(139,92,246,0.12)" }}>
                    <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs" style={{ color: "#374151" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search + filters */}
          <div className="mb-6 space-y-3" style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.1s" }}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: searchFocused ? "#a78bfa" : "#374151", fontSize: 15, transition: "color 0.2s" }}>⌕</span>
              <input type="text" placeholder="Search your projects..." value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                className="w-full rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(12,8,32,0.85)", padding: "0.875rem 1rem 0.875rem 2.75rem",
                  border: `1px solid ${searchFocused ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`,
                  boxShadow: searchFocused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
                }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button key={f} className="filter-btn" onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? "rgba(124,58,237,0.18)" : "rgba(12,8,32,0.85)",
                    border: `1px solid ${filter === f ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`,
                    color: filter === f ? "#a78bfa" : "#4b5563",
                  }}>
                  {f}
                  {f !== "All" && (
                    <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: filter === f ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.08)", color: filter === f ? "#a78bfa" : "#374151" }}>
                      {allProjects.filter(p => p.status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "#374151" }}>
              Showing <span style={{ color: "#a78bfa", fontWeight: 600 }}>{filtered.length}</span> projects
            </p>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i}
                  onManage={setSelected}
                  onDelete={handleDelete}
                  onWorkspace={(id) => navigate(`/workspace/${id}`)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24" style={{ animation: "fadeUp 0.4s ease both" }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)" }}>
                <span style={{ fontSize: 24 }}>📁</span>
              </div>
              <h3 className="text-white font-semibold mb-2">No projects found</h3>
              <p className="text-sm mb-5" style={{ color: "#374151" }}>
                {search ? "Try a different search term" : "Post your first project to get started"}
              </p>
              <button onClick={() => navigate("/projects/create")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
                + Post a Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Project panel modal */}
      {selected && (
        <ProjectPanel project={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />
      )}
    </>
  );
};

export default MyProjectsPage;