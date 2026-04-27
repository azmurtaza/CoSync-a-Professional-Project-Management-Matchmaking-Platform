import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ── Data ──────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, title: "AI Chess Bot", category: "AI / ML",
    description: "Building a chess engine powered by reinforcement learning. The bot will learn from millions of games and develop its own strategies.",
    roles: [{ label: "React Dev", color: "#61dafb" }, { label: "Python Dev", color: "#4ade80" }],
    stack: ["React", "Python", "PyTorch", "FastAPI"],
    author: { name: "Azaan Murtaza", avatar: "#7c3aed" },
    applicants: 7, status: "Open", posted: "2 days ago", deadline: "May 10",
    filled: 1, total: 3,
  },
  {
    id: 2, title: "Campus Rideshare App", category: "Mobile / Web",
    description: "A carpooling platform for NUST students to share rides between campus and hostels. Real-time location, split fares, ratings.",
    roles: [{ label: "React Native", color: "#a78bfa" }, { label: "Node.js", color: "#4ade80" }, { label: "Designer", color: "#f472b6" }],
    stack: ["React Native", "Node.js", "MongoDB", "Socket.io"],
    author: { name: "Hammad Ajmal", avatar: "#6d28d9" },
    applicants: 12, status: "Open", posted: "1 day ago", deadline: "May 15",
    filled: 1, total: 4,
  },
  {
    id: 3, title: "ML Research Paper Tool", category: "AI / ML",
    description: "A platform to discover, annotate, and summarize machine learning research papers using NLP. Think Semantic Scholar but better.",
    roles: [{ label: "ML Engineer", color: "#fb923c" }, { label: "Backend Dev", color: "#34d399" }],
    stack: ["Python", "HuggingFace", "FastAPI", "PostgreSQL"],
    author: { name: "Asad Kashif", avatar: "#8b5cf6" },
    applicants: 5, status: "Open", posted: "3 days ago", deadline: "May 20",
    filled: 2, total: 4,
  },
  {
    id: 4, title: "Smart Attendance System", category: "Hardware / IoT",
    description: "Face recognition based attendance for universities using Raspberry Pi. Auto-generates reports, sends absent alerts to parents.",
    roles: [{ label: "CV Engineer", color: "#f472b6" }, { label: "Embedded Dev", color: "#60a5fa" }],
    stack: ["OpenCV", "Python", "Raspberry Pi", "React"],
    author: { name: "Sara Qureshi", avatar: "#7c3aed" },
    applicants: 9, status: "Full",  posted: "5 days ago", deadline: "Apr 30",
    filled: 3, total: 3,
  },
  {
    id: 5, title: "Hackathon Team Finder", category: "Web App",
    description: "An app specifically for finding hackathon teammates last-minute. Browse by upcoming hackathon, required skills, and timezone.",
    roles: [{ label: "Full Stack", color: "#61dafb" }, { label: "UI/UX", color: "#f472b6" }],
    stack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
    author: { name: "Ali Hassan", avatar: "#a78bfa" },
    applicants: 3, status: "Open", posted: "6 hours ago", deadline: "May 5",
    filled: 1, total: 3,
  },
  {
    id: 6, title: "E-Sports Tournament Platform", category: "Web App",
    description: "Bracket management, live score updates, and team registration for university e-sports tournaments. Supports multiple game modes.",
    roles: [{ label: "React Dev", color: "#61dafb" }, { label: "Backend Dev", color: "#4ade80" }, { label: "Designer", color: "#f472b6" }],
    stack: ["React", "Express", "MongoDB", "WebSockets"],
    author: { name: "Umar Farooq", avatar: "#6d28d9" },
    applicants: 15, status: "Open", posted: "4 days ago", deadline: "May 12",
    filled: 0, total: 3,
  },
  {
    id: 7, title: "Mental Health Chatbot", category: "AI / ML",
    description: "An empathetic AI chatbot for student mental health support. Trained on CBT techniques, with escalation to real counselors.",
    roles: [{ label: "NLP Engineer", color: "#fb923c" }, { label: "React Dev", color: "#61dafb" }],
    stack: ["Python", "GPT-4 API", "React", "Node.js"],
    author: { name: "Fatima Malik", avatar: "#8b5cf6" },
    applicants: 6, status: "Open", posted: "1 week ago", deadline: "May 18",
    filled: 1, total: 3,
  },
  {
    id: 8, title: "Blockchain Voting System", category: "Blockchain",
    description: "A transparent, tamper-proof student council voting system on Ethereum. Smart contracts ensure every vote is verifiable.",
    roles: [{ label: "Solidity Dev", color: "#a78bfa" }, { label: "React Dev", color: "#61dafb" }],
    stack: ["Solidity", "Hardhat", "React", "Ethers.js"],
    author: { name: "Bilal Ahmed", avatar: "#7c3aed" },
    applicants: 4, status: "Open", posted: "2 days ago", deadline: "May 22",
    filled: 1, total: 3,
  },
];

const CATEGORIES = ["All", "AI / ML", "Web App", "Mobile / Web", "Blockchain", "Hardware / IoT"];
const ALL_STACKS = ["React", "Python", "Node.js", "MongoDB", "FastAPI", "PyTorch", "Next.js", "Solidity"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const SkillPill = ({ label, color }) => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
    style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}
  >
    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
    {label}
  </span>
);

const RoleBadge = ({ label, color }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
    style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}
  >
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="3" stroke={color} strokeWidth="1.5" />
    </svg>
    {label}
  </span>
);

// ── Apply Modal ───────────────────────────────────────────────────────────────
const ApplyModal = ({ project, onClose, isAuth }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isAuth) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <div
          className="rounded-2xl p-8 max-w-sm w-full text-center"
          style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
            <span style={{ fontSize: 20 }}>🔒</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Sign in to apply</h3>
          <p className="text-gray-500 text-sm mb-6">Create a free account to apply to projects and build your team.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#9ca3af" }}>Cancel</button>
            <button onClick={() => navigate("/register")} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>Get started</button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <div
          className="rounded-2xl p-8 max-w-sm w-full text-center"
          style={{ background: "#0a0520", border: "1px solid rgba(34,197,94,0.25)" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}>
            <span style={{ fontSize: 24 }}>✓</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Application sent!</h3>
          <p className="text-gray-500 text-sm mb-2">Your application to <span style={{ color: "#a78bfa" }}>{project.title}</span> has been submitted.</p>
          <p className="text-gray-600 text-xs mb-6">The project lead will review it and get back to you.</p>
          <button onClick={onClose} className="w-full py-2.5 rounded-lg text-sm font-semibold" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full"
        style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)", animation: "modalIn 0.25s ease both" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-lg">Apply to join</h3>
            <p className="text-sm" style={{ color: "#a78bfa" }}>{project.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.roles.map(r => <RoleBadge key={r.label} {...r} />)}
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1.5" style={{ color: focused ? "#a78bfa" : "#9ca3af" }}>
            Why do you want to join? <span style={{ color: "#4b5563" }}>(optional)</span>
          </label>
          <textarea
            rows={4}
            placeholder="Tell the project lead what you bring to the table — your relevant skills, experience, or why this project excites you..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none transition-all duration-200"
            style={{
              background: "rgba(15,10,40,0.8)",
              border: `1px solid ${focused ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.15)"}`,
              padding: "0.75rem",
              boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
            }}
          />
          <p className="text-xs mt-1" style={{ color: "#374151" }}>{message.length}/500</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", color: "#9ca3af", cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 25px rgba(124,58,237,0.4)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            Send application →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, onApply, index }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const fillPct = Math.round((project.filled / project.total) * 100);

  return (
    <div
      className="rounded-2xl border relative overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        background: hovered ? "rgba(20,12,50,0.95)" : "rgba(12,8,32,0.85)",
        borderColor: hovered ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.12)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(109,40,217,0.2)" : "none",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${index * 0.07}s`,
        cursor: "pointer",
      }}
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top glow on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                {project.category}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{
                  background: project.status === "Open" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: project.status === "Open" ? "#4ade80" : "#f87171",
                  border: `1px solid ${project.status === "Open" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                }}
              >
                {project.status === "Open" ? "● Open" : "◉ Full"}
              </span>
            </div>
            <h3 className="text-white font-bold text-base leading-tight">{project.title}</h3>
          </div>
          {/* Author avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: project.author.avatar, color: "#fff" }}
            title={project.author.name}
          >
            {project.author.name[0]}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "#6b7280" }}>
          {project.description}
        </p>

        {/* Roles needed */}
        <div className="mb-3">
          <p className="text-xs mb-2" style={{ color: "#374151" }}>Roles needed</p>
          <div className="flex flex-wrap gap-1.5">
            {project.roles.map(r => <RoleBadge key={r.label} {...r} />)}
          </div>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.stack.map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#4b5563", border: "1px solid rgba(255,255,255,0.06)" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Team fill bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: "#374151" }}>Team filled</span>
            <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>{project.filled}/{project.total} members</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(139,92,246,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${fillPct}%`,
                background: fillPct === 100 ? "#4ade80" : "linear-gradient(90deg,#7c3aed,#a78bfa)",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#374151" }}>
              <span style={{ color: "#6b7280" }}>{project.applicants}</span> applicants
            </span>
            <span className="text-xs" style={{ color: "#374151" }}>· {project.posted}</span>
          </div>
          <button
            onClick={() => onApply(project)}
            disabled={project.status === "Full"}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: project.status === "Full" ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: project.status === "Full" ? "#374151" : "#fff",
              border: project.status === "Full" ? "1px solid rgba(255,255,255,0.06)" : "none",
              cursor: project.status === "Full" ? "not-allowed" : "pointer",
              boxShadow: project.status !== "Full" && hovered ? "0 4px 15px rgba(124,58,237,0.35)" : "none",
            }}
          >
            {project.status === "Full" ? "Team full" : "Apply →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Feed Page ────────────────────────────────────────────────────────────
const ProjectsFeedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(s => s.auth);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeStack, setActiveStack] = useState("");
  const [applyProject, setApplyProject] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchStatus = activeStatus === "All" || p.status === activeStatus;
      const matchStack = !activeStack || p.stack.includes(activeStack);
      return matchSearch && matchCat && matchStatus && matchStack;
    });
  }, [search, activeCategory, activeStatus, activeStack]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; } 50% { opacity:0.4; }
        }
        .nav-link { color:#6b7280; font-size:0.875rem; text-decoration:none; transition:color 0.2s; }
        .nav-link:hover { color:#fff; }
        .filter-btn {
          padding: 0.375rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          border: none;
        }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#05030f", color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif" }}>

        {/* ── Navbar ── */}
        <nav
          className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto"
          style={{ borderBottom: "1px solid rgba(139,92,246,0.08)", backdropFilter: "blur(20px)", background: "rgba(5,3,15,0.85)", animation: "slideDown 0.4s ease both" }}
        >
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="flex items-center gap-2" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>C</div>
              <span className="font-semibold text-white tracking-tight">CoSync</span>
            </button>
            <div className="hidden md:flex items-center gap-5">
              <a href="/feed" className="nav-link" style={{ color: "#a78bfa", fontWeight: 500 }}>Projects</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="text-sm font-medium transition-colors duration-200" style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                >
                  Sign in
                </button>
                <button onClick={() => navigate("/register")} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
                  Get started
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* ── Hero header ── */}
          <div className="mb-10" style={{ animation: "fadeUp 0.5s ease both" }}>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse-dot 2s ease-in-out infinite" }}
                  />
                  <span className="text-xs font-medium" style={{ color: "#4ade80" }}>
                    {PROJECTS.filter(p => p.status === "Open").length} projects actively recruiting
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ letterSpacing: "-0.025em" }}>
                  Find your next project
                </h1>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  Browse open projects, find your role, apply to join a team.
                </p>
              </div>
              <button
                onClick={() => isAuthenticated ? navigate("/projects/create") : navigate("/register")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(124,58,237,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <span style={{ fontSize: 14 }}>+</span>
                Post a project
              </button>
            </div>
          </div>

          {/* ── Search + Filters ── */}
          <div className="mb-8 space-y-4" style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.1s" }}>

            {/* Search bar */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: searchFocused ? "#a78bfa" : "#374151", transition: "color 0.2s" }}>
                ⌕
              </span>
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(12,8,32,0.85)",
                  border: `1px solid ${searchFocused ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`,
                  padding: "0.875rem 1rem 0.875rem 2.75rem",
                  boxShadow: searchFocused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Category filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className="filter-btn"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: activeCategory === cat ? "rgba(124,58,237,0.2)" : "rgba(12,8,32,0.85)",
                      border: `1px solid ${activeCategory === cat ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`,
                      color: activeCategory === cat ? "#a78bfa" : "#4b5563",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px" style={{ background: "rgba(139,92,246,0.15)" }} />

              {/* Status */}
              {["All", "Open", "Full"].map(s => (
                <button
                  key={s}
                  className="filter-btn"
                  onClick={() => setActiveStatus(s)}
                  style={{
                    background: activeStatus === s ? "rgba(124,58,237,0.15)" : "transparent",
                    border: `1px solid ${activeStatus === s ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`,
                    color: activeStatus === s ? "#a78bfa" : "#374151",
                  }}
                >
                  {s === "Open" ? "● Open" : s === "Full" ? "◉ Full" : s}
                </button>
              ))}

              <div className="h-5 w-px hidden md:block" style={{ background: "rgba(139,92,246,0.15)" }} />

              {/* Stack quick filter */}
              <div className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {ALL_STACKS.map(st => (
                  <button
                    key={st}
                    className="filter-btn"
                    onClick={() => setActiveStack(activeStack === st ? "" : st)}
                    style={{
                      background: activeStack === st ? "rgba(97,218,251,0.08)" : "transparent",
                      border: `1px solid ${activeStack === st ? "rgba(97,218,251,0.3)" : "rgba(139,92,246,0.08)"}`,
                      color: activeStack === st ? "#61dafb" : "#374151",
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "#374151" }}>
                Showing <span style={{ color: "#a78bfa", fontWeight: 600 }}>{filtered.length}</span> of {PROJECTS.length} projects
                {search && <span> matching "<span style={{ color: "#fff" }}>{search}</span>"</span>}
              </p>
              {(search || activeCategory !== "All" || activeStatus !== "All" || activeStack) && (
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All"); setActiveStatus("All"); setActiveStack(""); }}
                  className="text-xs transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#a78bfa"}
                  onMouseLeave={e => e.currentTarget.style.color = "#4b5563"}
                >
                  Clear all filters ✕
                </button>
              )}
            </div>
          </div>

          {/* ── Grid ── */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} onApply={setApplyProject} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24" style={{ animation: "fadeUp 0.4s ease both" }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)" }}>
                <span style={{ fontSize: 24 }}>🔍</span>
              </div>
              <h3 className="text-white font-semibold mb-2">No projects found</h3>
              <p className="text-sm mb-5" style={{ color: "#374151" }}>Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); setActiveStatus("All"); setActiveStack(""); }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", cursor: "pointer" }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* ── CTA banner ── */}
          {!isAuthenticated && (
            <div
              className="mt-12 rounded-2xl p-8 text-center relative overflow-hidden"
              style={{ background: "rgba(12,8,32,0.8)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(109,40,217,0.15) 0%, transparent 70%)" }} />
              <h2 className="text-xl font-bold text-white mb-2 relative" style={{ letterSpacing: "-0.02em" }}>
                Got a project idea?
              </h2>
              <p className="text-sm mb-5 relative" style={{ color: "#4b5563" }}>
                Sign up and post your project to find the perfect teammates.
              </p>
              <div className="flex items-center justify-center gap-3 relative">
                <button onClick={() => navigate("/register")} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
                  Post your project
                </button>
                <button onClick={() => navigate("/login")} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: "transparent", border: "1px solid rgba(139,92,246,0.2)", color: "#6b7280", cursor: "pointer" }}>
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Apply modal ── */}
      {applyProject && (
        <ApplyModal
          project={applyProject}
          onClose={() => setApplyProject(null)}
          isAuth={isAuthenticated}
        />
      )}
    </>
  );
};

export default ProjectsFeedPage;