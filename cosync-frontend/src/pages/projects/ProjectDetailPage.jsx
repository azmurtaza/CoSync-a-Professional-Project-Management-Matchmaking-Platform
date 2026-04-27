import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// ── All projects data ─────────────────────────────────────────────────────────
const ALL_PROJECTS = [
  {
    id: 1, title: "AI Chess Bot", category: "AI / ML", status: "Open",
    tagline: "Teaching a machine to think 10 moves ahead",
    description: "Building a chess engine powered by reinforcement learning. The bot will learn from millions of games and develop its own unique playing style. We plan to train on Lichess game data and implement a neural network evaluation function.",
    problem: "Existing open-source chess engines are either too complex to understand or too weak to be interesting. We want to build something educational that demonstrates how RL works in a game context.",
    roles: [
      { label: "React Developer", color: "#61dafb", skills: ["React", "TypeScript", "CSS"], filled: false },
      { label: "Python / ML Engineer", color: "#4ade80", skills: ["PyTorch", "NumPy", "RL algorithms"], filled: true },
    ],
    stack: ["React", "Python", "PyTorch", "FastAPI", "MongoDB", "Docker"],
    team: [
      { name: "Azaan Murtaza", role: "Project Lead & ML", avatar: "#7c3aed", joined: "2 days ago" },
      { name: "Sara Qureshi",  role: "ML Engineer",       avatar: "#a78bfa", joined: "1 day ago"  },
    ],
    author: { name: "Azaan Murtaza", avatar: "#7c3aed", university: "NUST SEECS" },
    applicants: 7, deadline: "May 10, 2026", duration: "2–3 months",
    difficulty: "Advanced", teamSize: "3 members", isRemote: true,
    posted: "2 days ago", filled: 1, total: 3,
    github: "https://github.com/example/ai-chess", figma: "", website: "",
    perks: ["Portfolio project", "Open source contribution", "Research publication"],
    applicationQuestion: "What's your experience with ML models?",
    tags: ["AI", "Chess", "RL", "PyTorch"],
  },
  {
    id: 2, title: "Campus Rideshare App", category: "Mobile / Web", status: "Open",
    tagline: "Carpooling made easy for university students",
    description: "A carpooling platform for NUST students to share rides between campus and hostels. Features real-time location tracking, fare splitting, and a rating system to build trust between riders.",
    problem: "Students waste money on individual rides and there's no safe, trusted platform to connect drivers and passengers within the university community.",
    roles: [
      { label: "React Native Dev", color: "#a78bfa", skills: ["React Native", "Expo", "Navigation"], filled: true },
      { label: "Node.js Backend",  color: "#4ade80", skills: ["Node.js", "Express", "MongoDB"],      filled: false },
      { label: "UI/UX Designer",   color: "#f472b6", skills: ["Figma", "Prototyping", "User Research"], filled: false },
    ],
    stack: ["React Native", "Node.js", "MongoDB", "Socket.io", "Google Maps API"],
    team: [
      { name: "Hammad Ajmal", role: "Project Lead", avatar: "#6d28d9", joined: "3 days ago" },
    ],
    author: { name: "Hammad Ajmal", avatar: "#6d28d9", university: "NUST SEECS" },
    applicants: 12, deadline: "May 15, 2026", duration: "2–3 months",
    difficulty: "Intermediate", teamSize: "4 members", isRemote: true,
    posted: "1 day ago", filled: 1, total: 4,
    github: "", figma: "https://figma.com/file/example", website: "",
    perks: ["Portfolio project", "Startup opportunity", "Certificate of completion"],
    applicationQuestion: "",
    tags: ["Mobile", "Maps", "Real-time", "University"],
  },
  {
    id: 3, title: "ML Research Paper Tool", category: "AI / ML", status: "Open",
    tagline: "Discover and summarize ML research with NLP",
    description: "A platform to discover, annotate, and summarize machine learning research papers using NLP. Think Semantic Scholar but tailored for students — with plain English summaries, key contributions highlighted, and related paper recommendations.",
    problem: "Reading ML research papers is overwhelming for students. Dense jargon, complex math, and no clear structure makes it hard to keep up with the field.",
    roles: [
      { label: "NLP / ML Engineer", color: "#fb923c", skills: ["HuggingFace", "Transformers", "Python"], filled: true },
      { label: "Backend Developer",  color: "#34d399", skills: ["FastAPI", "PostgreSQL", "REST APIs"],    filled: true },
    ],
    stack: ["Python", "HuggingFace", "FastAPI", "PostgreSQL", "React", "Redis"],
    team: [
      { name: "Asad Kashif",  role: "Project Lead", avatar: "#8b5cf6", joined: "4 days ago" },
      { name: "Fatima Malik", role: "NLP Engineer",  avatar: "#fb923c", joined: "3 days ago" },
      { name: "Omar Sheikh",  role: "Backend Dev",   avatar: "#34d399", joined: "2 days ago" },
    ],
    author: { name: "Asad Kashif", avatar: "#8b5cf6", university: "NUST SEECS" },
    applicants: 5, deadline: "May 20, 2026", duration: "3–6 months",
    difficulty: "Advanced", teamSize: "4 members", isRemote: true,
    posted: "3 days ago", filled: 2, total: 4,
    github: "https://github.com/example/ml-paper-tool", figma: "", website: "",
    perks: ["Research publication", "Open source contribution", "Portfolio project"],
    applicationQuestion: "Which NLP models have you worked with?",
    tags: ["NLP", "Research", "HuggingFace", "Education"],
  },
  {
    id: 5, title: "Hackathon Team Finder", category: "Web App", status: "Open",
    tagline: "Find your hackathon dream team in minutes",
    description: "An app specifically for finding hackathon teammates last-minute. Browse by upcoming hackathon, required skills, and timezone. Post your skills and get matched instantly.",
    problem: "Finding hackathon teammates is chaotic — Discord servers, WhatsApp groups, and spreadsheets are inefficient. Students miss hackathons because they can't find a team in time.",
    roles: [
      { label: "Full Stack Dev", color: "#61dafb", skills: ["Next.js", "Prisma", "tRPC"], filled: true },
      { label: "UI/UX Designer", color: "#f472b6", skills: ["Figma", "Tailwind", "Framer"], filled: false },
    ],
    stack: ["Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "Vercel"],
    team: [
      { name: "Ali Hassan", role: "Project Lead", avatar: "#a78bfa", joined: "6 hours ago" },
    ],
    author: { name: "Ali Hassan", avatar: "#a78bfa", university: "NUST SEECS" },
    applicants: 3, deadline: "May 5, 2026", duration: "1 month",
    difficulty: "Intermediate", teamSize: "3 members", isRemote: true,
    posted: "6 hours ago", filled: 1, total: 3,
    github: "", figma: "", website: "",
    perks: ["Hackathon submission", "Portfolio project"],
    applicationQuestion: "",
    tags: ["Hackathon", "Matching", "Real-time"],
  },
];

const SKILL_COLORS = ["#61dafb","#a78bfa","#4ade80","#fb923c","#f472b6","#34d399","#60a5fa","#fbbf24"];

// ── Apply Modal ───────────────────────────────────────────────────────────────
const ApplyModal = ({ project, onClose, isAuth, navigate }) => {
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const openRoles = project.roles.filter(r => !r.filled);

  const inputStyle = (f) => ({
    background: "rgba(15,10,40,0.8)",
    border: `1px solid ${focused === f ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.15)"}`,
    borderRadius: 10, color: "#fff", fontSize: "0.875rem",
    outline: "none", width: "100%", fontFamily: "inherit",
    padding: "0.625rem 0.875rem", transition: "all 0.2s",
    boxShadow: focused === f ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
    resize: "none",
  });

  if (!isAuth) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)", animation: "modalIn 0.25s ease both" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
          <span style={{ fontSize: 20 }}>🔒</span>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Sign in to apply</h3>
        <p className="text-sm mb-6" style={{ color: "#4b5563" }}>Create a free account to apply to projects.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#9ca3af", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={() => navigate("/register")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
            Get started
          </button>
        </div>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{ background: "#0a0520", border: "1px solid rgba(74,222,128,0.25)", animation: "modalIn 0.25s ease both" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(74,222,128,0.15)" }}>
          <span style={{ fontSize: 28 }}>🎉</span>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Application sent!</h3>
        <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
          Applied to <span style={{ color: "#a78bfa" }}>{project.title}</span>
        </p>
        <p className="text-xs mb-6" style={{ color: "#374151" }}>The project lead will review and respond soon.</p>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)", animation: "modalIn 0.25s ease both" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">Apply to join</h3>
              <p className="text-sm mt-0.5" style={{ color: "#a78bfa" }}>{project.title}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 22 }}>×</button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "#6b7280" }}>
              Which role are you applying for? <span style={{ color: "#7c3aed" }}>*</span>
            </label>
            <div className="space-y-2">
              {openRoles.map(r => (
                <button key={r.label} type="button" onClick={() => setSelectedRole(r.label)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: selectedRole === r.label ? `${r.color}12` : "rgba(139,92,246,0.04)",
                    border: `1px solid ${selectedRole === r.label ? r.color + "40" : "rgba(139,92,246,0.1)"}`,
                    cursor: "pointer",
                  }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: selectedRole === r.label ? r.color : "#fff" }}>{r.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{r.skills.join(", ")}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b7280" }}>
              Why do you want to join? <span style={{ color: "#374151" }}>(optional)</span>
            </label>
            <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
              onFocus={() => setFocused("msg")} onBlur={() => setFocused(null)}
              placeholder="Tell the project lead what you bring — skills, experience, why this excites you..."
              style={inputStyle("msg")} />
            <p className="text-xs mt-1" style={{ color: "#374151" }}>{message.length}/500</p>
          </div>

          {/* Custom question */}
          {project.applicationQuestion && (
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b7280" }}>
                {project.applicationQuestion} <span style={{ color: "#7c3aed" }}>*</span>
              </label>
              <textarea rows={3} value={answer} onChange={e => setAnswer(e.target.value)}
                onFocus={() => setFocused("ans")} onBlur={() => setFocused(null)}
                placeholder="Your answer..."
                style={inputStyle("ans")} />
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex gap-3" style={{ borderTop: "1px solid rgba(139,92,246,0.1)", paddingTop: 16 }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", color: "#6b7280", cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={() => { if (selectedRole || openRoles.length === 0) setSubmitted(true); }}
            disabled={openRoles.length > 0 && !selectedRole}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: (openRoles.length === 0 || selectedRole) ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(139,92,246,0.1)",
              color: (openRoles.length === 0 || selectedRole) ? "#fff" : "#374151",
              border: "none", cursor: (openRoles.length === 0 || selectedRole) ? "pointer" : "not-allowed",
            }}
            onMouseEnter={e => { if (selectedRole) e.currentTarget.style.boxShadow = "0 8px 25px rgba(124,58,237,0.4)"; }}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            Send application →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [showApply, setShowApply] = useState(false);

  const project = ALL_PROJECTS.find(p => p.id === parseInt(id));
  const similar = ALL_PROJECTS.filter(p => p.id !== parseInt(id) && p.category === project?.category).slice(0, 2);

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "#05030f", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <div className="text-center">
        <p className="text-white text-xl font-bold mb-2">Project not found</p>
        <button onClick={() => navigate("/feed")} className="text-sm px-4 py-2 rounded-xl mt-3"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}>
          Back to Feed
        </button>
      </div>
    </div>
  );

  const fillPct = Math.round((project.filled / project.total) * 100);
  const openRoles = project.roles.filter(r => !r.filled);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .nav-btn { background:none; border:none; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .section-card { background:rgba(12,8,32,0.8); border:1px solid rgba(139,92,246,0.1); border-radius:16px; padding:20px; margin-bottom:16px; }
        .section-title { font-size:0.75rem; font-weight:600; color:#4b5563; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#05030f", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#fff" }}>

        {/* Navbar */}
        <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5"
          style={{ background: "rgba(5,3,15,0.92)", borderBottom: "1px solid rgba(139,92,246,0.08)", backdropFilter: "blur(20px)", animation: "slideDown 0.4s ease both" }}>
          <div className="flex items-center gap-2">
            <button className="nav-btn flex items-center gap-2" onClick={() => navigate("/")}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>C</div>
              <span className="font-semibold text-white">CoSync</span>
            </button>
            <span style={{ color: "#374151" }}>›</span>
            <button className="nav-btn text-sm" style={{ color: "#4b5563" }} onClick={() => navigate("/feed")}>Projects</button>
            <span style={{ color: "#374151" }}>›</span>
            <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>{project.title}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/feed")} className="nav-btn text-sm px-3 py-1.5 rounded-lg"
              style={{ border: "1px solid rgba(139,92,246,0.15)", color: "#6b7280" }}>
              ← Browse
            </button>
            {isAuthenticated && (
              <button onClick={() => navigate("/dashboard")} className="nav-btn text-sm px-3 py-1.5 rounded-lg"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff" }}>
                Dashboard
              </button>
            )}
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left — main content ── */}
            <div className="lg:col-span-2 space-y-4" style={{ animation: "fadeUp 0.5s ease both" }}>

              {/* Hero card */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(12,8,32,0.9)", border: "1px solid rgba(139,92,246,0.15)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa,#c084fc)" }} />
                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-md font-medium"
                      style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                      {project.category}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md font-medium"
                      style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}>
                      ● {project.status}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md"
                      style={{ background: "rgba(139,92,246,0.06)", color: "#374151", border: "1px solid rgba(139,92,246,0.1)" }}>
                      {project.difficulty}
                    </span>
                    {project.isRemote && (
                      <span className="text-xs px-2.5 py-1 rounded-md"
                        style={{ background: "rgba(96,165,250,0.08)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                        🌐 Remote
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>{project.title}</h1>
                  {project.tagline && <p className="text-base mb-4" style={{ color: "#a78bfa" }}>{project.tagline}</p>}

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: project.author.avatar + "30", color: project.author.avatar }}>
                      {project.author.name[0]}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{project.author.name}</span>
                      <span className="text-xs ml-2" style={{ color: "#374151" }}>{project.author.university} · Posted {project.posted}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t, i) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: `${SKILL_COLORS[i % SKILL_COLORS.length]}10`, color: SKILL_COLORS[i % SKILL_COLORS.length], border: `1px solid ${SKILL_COLORS[i % SKILL_COLORS.length]}25` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="section-card">
                <p className="section-title">About this project</p>
                <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{project.description}</p>
              </div>

              {/* Problem statement */}
              {project.problem && (
                <div className="section-card">
                  <p className="section-title">Problem we're solving</p>
                  <div className="flex gap-3">
                    <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: "linear-gradient(to bottom,#7c3aed,#a78bfa)", minHeight: 40 }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{project.problem}</p>
                  </div>
                </div>
              )}

              {/* Roles needed */}
              <div className="section-card">
                <p className="section-title">Roles needed</p>
                <div className="space-y-3">
                  {project.roles.map(r => (
                    <div key={r.label} className="flex items-start justify-between p-4 rounded-xl"
                      style={{ background: r.filled ? "rgba(139,92,246,0.03)" : `${r.color}08`, border: `1px solid ${r.filled ? "rgba(139,92,246,0.08)" : r.color + "25"}` }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: r.color + "15", border: `1px solid ${r.color}30` }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{r.label}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {r.skills.map(s => (
                              <span key={s} className="text-xs px-2 py-0.5 rounded"
                                style={{ background: "rgba(255,255,255,0.04)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                        style={{
                          background: r.filled ? "rgba(248,113,113,0.08)" : "rgba(74,222,128,0.1)",
                          color: r.filled ? "#f87171" : "#4ade80",
                          border: `1px solid ${r.filled ? "rgba(248,113,113,0.2)" : "rgba(74,222,128,0.25)"}`,
                        }}>
                        {r.filled ? "Filled" : "Open"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div className="section-card">
                <p className="section-title">Tech stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s, i) => (
                    <span key={s} className="text-sm px-3 py-1.5 rounded-xl font-medium"
                      style={{ background: `${SKILL_COLORS[i % SKILL_COLORS.length]}12`, border: `1px solid ${SKILL_COLORS[i % SKILL_COLORS.length]}30`, color: SKILL_COLORS[i % SKILL_COLORS.length] }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team members */}
              <div className="section-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="section-title" style={{ marginBottom: 0 }}>Current team</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
                      <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
                    </div>
                    <span className="text-xs" style={{ color: "#a78bfa" }}>{project.filled}/{project.total}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {project.team.map((m, i) => (
                    <div key={m.name} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: m.avatar + "25", color: m.avatar, border: `1px solid ${m.avatar}35` }}>
                          {m.name[0]}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{m.name}</p>
                          <p className="text-xs" style={{ color: "#4b5563" }}>{m.role} · Joined {m.joined}</p>
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
                  {/* Empty slots */}
                  {Array.from({ length: project.total - project.filled }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: "rgba(139,92,246,0.03)", border: "1px dashed rgba(139,92,246,0.15)" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(139,92,246,0.06)", border: "1px dashed rgba(139,92,246,0.15)" }}>
                        <span style={{ color: "#374151", fontSize: 16 }}>+</span>
                      </div>
                      <p className="text-sm" style={{ color: "#374151" }}>Open slot — apply to join</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perks */}
              {project.perks?.length > 0 && (
                <div className="section-card">
                  <p className="section-title">What you'll get</p>
                  <div className="flex flex-wrap gap-2">
                    {project.perks.map(p => (
                      <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm"
                        style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", color: "#9ca3af" }}>
                        ✦ {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar projects */}
              {similar.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-white mb-3">Similar projects</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {similar.map(s => (
                      <div key={s.id} onClick={() => navigate(`/projects/${s.id}`)}
                        className="p-4 rounded-2xl transition-all duration-200 cursor-pointer"
                        style={{ background: "rgba(12,8,32,0.8)", border: "1px solid rgba(139,92,246,0.1)" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.background = "rgba(20,12,50,0.9)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)"; e.currentTarget.style.background = "rgba(12,8,32,0.8)"; }}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white text-sm font-semibold">{s.title}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                            style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>Open</span>
                        </div>
                        <p className="text-xs leading-relaxed mb-2" style={{ color: "#4b5563" }}>
                          {s.description.slice(0, 70)}...
                        </p>
                        <p className="text-xs" style={{ color: "#a78bfa" }}>View project →</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-4" style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.15s" }}>

              {/* Apply CTA */}
              <div className="rounded-2xl p-5 sticky top-24"
                style={{ background: "rgba(12,8,32,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                  <div style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,40,217,0.15) 0%, transparent 70%)" }} className="absolute inset-0" />
                </div>

                <div className="relative">
                  {/* Applicants */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{project.applicants}</span>
                      <span className="text-xs" style={{ color: "#4b5563" }}>applicants</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
                      ● Accepting
                    </span>
                  </div>

                  {/* Open roles */}
                  {openRoles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: "#4b5563" }}>Open roles</p>
                      <div className="space-y-1.5">
                        {openRoles.map(r => (
                          <div key={r.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{ background: `${r.color}08`, border: `1px solid ${r.color}20` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
                            <span className="text-xs font-medium" style={{ color: r.color }}>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Apply button */}
                  <button
                    onClick={() => setShowApply(true)}
                    disabled={project.status === "Full"}
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 mb-3"
                    style={{
                      background: project.status === "Full" ? "rgba(139,92,246,0.05)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                      color: project.status === "Full" ? "#374151" : "#fff",
                      border: project.status === "Full" ? "1px solid rgba(139,92,246,0.1)" : "none",
                      cursor: project.status === "Full" ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={e => { if (project.status !== "Full") e.currentTarget.style.boxShadow = "0 10px 30px rgba(124,58,237,0.4)"; }}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    {project.status === "Full" ? "Team is full" : "Apply to Join →"}
                  </button>

                  <button onClick={() => navigate("/feed")}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{ background: "transparent", border: "1px solid rgba(139,92,246,0.15)", color: "#6b7280", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.15)"; }}>
                    Browse other projects
                  </button>
                </div>
              </div>

              {/* Project details */}
              <div className="section-card">
                <p className="section-title">Project details</p>
                <div className="space-y-3">
                  {[
                    { label: "Duration",   value: project.duration,  icon: "⏱" },
                    { label: "Team size",  value: project.teamSize,  icon: "👥" },
                    { label: "Difficulty", value: project.difficulty, icon: "⚡" },
                    { label: "Deadline",   value: project.deadline,  icon: "📅" },
                    { label: "Remote",     value: project.isRemote ? "Yes" : "No", icon: "🌐" },
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between py-2"
                      style={{ borderBottom: "1px solid rgba(139,92,246,0.06)" }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13 }}>{d.icon}</span>
                        <span className="text-xs" style={{ color: "#4b5563" }}>{d.label}</span>
                      </div>
                      <span className="text-xs font-medium text-white">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.github || project.figma || project.website) && (
                <div className="section-card">
                  <p className="section-title">Project links</p>
                  <div className="space-y-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
                        style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)", color: "#9ca3af", textDecoration: "none" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)"; }}>
                        <span style={{ fontSize: 14 }}>⌥</span>
                        <span className="text-sm">GitHub Repository</span>
                        <span className="ml-auto" style={{ fontSize: 12 }}>↗</span>
                      </a>
                    )}
                    {project.figma && (
                      <a href={project.figma} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
                        style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)", color: "#9ca3af", textDecoration: "none" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)"; }}>
                        <span style={{ fontSize: 14 }}>🎨</span>
                        <span className="text-sm">Figma Design</span>
                        <span className="ml-auto" style={{ fontSize: 12 }}>↗</span>
                      </a>
                    )}
                    {project.website && (
                      <a href={project.website} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
                        style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)", color: "#9ca3af", textDecoration: "none" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)"; }}>
                        <span style={{ fontSize: 14 }}>🌐</span>
                        <span className="text-sm">Live Website</span>
                        <span className="ml-auto" style={{ fontSize: 12 }}>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApply && (
        <ApplyModal
          project={project}
          onClose={() => setShowApply(false)}
          isAuth={isAuthenticated}
          navigate={navigate}
        />
      )}
    </>
  );
};

export default ProjectDetailPage;