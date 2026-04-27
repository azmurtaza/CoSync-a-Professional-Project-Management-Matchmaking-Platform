import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SKILL_COLORS = ["#61dafb","#a78bfa","#4ade80","#fb923c","#f472b6","#34d399","#60a5fa","#fbbf24","#e879f9","#38bdf8"];
const ROLES = ["Developer","Designer","Project Manager","ML Engineer","DevOps","Mobile Developer","Other"];
const DEGREES = ["BS Computer Science","BS Software Engineering","BS AI","BS Data Science","MS Computer Science","Other"];
const UNIVERSITIES = ["NUST","FAST-NUCES","LUMS","COMSATS","UET Lahore","IBA Karachi","Other"];

const inputStyle = (focused, error) => ({
  background: "rgba(15,10,40,0.8)",
  border: `1px solid ${error ? "#ef4444" : focused ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.15)"}`,
  borderRadius: 10, color: "#fff", fontSize: "0.875rem", outline: "none",
  transition: "all 0.2s", width: "100%", fontFamily: "inherit",
  boxShadow: focused && !error ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
  padding: "0.625rem 0.875rem",
});

const Field = ({ label, children, hint }) => (
  <div className="mb-5">
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold" style={{ color: "#6b7280" }}>{label}</label>
      {hint && <span className="text-xs" style={{ color: "#374151" }}>{hint}</span>}
    </div>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder, type = "text" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={inputStyle(focused, false)} />
  );
};

const SelectInput = ({ value, onChange, options, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle(focused, false), appearance: "none", cursor: "pointer", color: value ? "#fff" : "#4b5563" }}>
        <option value="" style={{ background: "#0a0520" }}>{placeholder}</option>
        {options.map(o => <option key={o} value={o} style={{ background: "#0a0520", color: "#fff" }}>{o}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: "#4b5563" }}>▾</span>
    </div>
  );
};

const SkillTagInput = ({ skills, setSkills }) => {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const add = (v) => { const s = v.trim(); if (s && !skills.includes(s) && skills.length < 15) setSkills([...skills, s]); setInput(""); };
  const onKey = (e) => { if (["Enter", ",", "Tab"].includes(e.key)) { e.preventDefault(); if (input.trim()) add(input); } else if (e.key === "Backspace" && !input && skills.length) setSkills(skills.slice(0, -1)); };
  return (
    <div style={{ ...inputStyle(focused, false), padding: "0.5rem", minHeight: 44, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}
      onClick={() => document.getElementById("skill-tag-inp")?.focus()}>
      {skills.map((s, i) => (
        <span key={s} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ background: `${SKILL_COLORS[i % SKILL_COLORS.length]}15`, border: `1px solid ${SKILL_COLORS[i % SKILL_COLORS.length]}35`, color: SKILL_COLORS[i % SKILL_COLORS.length] }}>
          {s}
          <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", lineHeight: 1 }}>×</button>
        </span>
      ))}
      <input id="skill-tag-inp" value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={onKey} onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); if (input.trim()) add(input); }}
        placeholder={skills.length === 0 ? "React, Python, Figma... (press Enter)" : ""}
        style={{ flex: 1, minWidth: 120, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.875rem", fontFamily: "inherit" }} />
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({
    name: user?.name || "User",
    email: user?.email || "",
    bio: "Final year CS student at NUST passionate about AI and full-stack development. Love hackathons and building real-world tools.",
    university: "NUST",
    degree: "BS Computer Science",
    role: "Developer",
    skills: ["React", "Python", "Node.js", "MongoDB", "PyTorch"],
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    website: "",
    availability: "Available",
    experience: "Intermediate",
  });

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS = ["profile", "skills", "links", "activity"];

  // Stats
  const STATS = [
    { label: "Projects Posted", value: "1", color: "#a78bfa" },
    { label: "Applications", value: "4", color: "#61dafb" },
    { label: "Teams Joined", value: "1", color: "#4ade80" },
    { label: "Match Score", value: "87%", color: "#fb923c" },
  ];

  const ACTIVITY = [
    { icon: "📁", text: "Posted AI Chess Bot", time: "2 days ago", color: "#a78bfa" },
    { icon: "📨", text: "Applied to E-Sports Platform", time: "5 days ago", color: "#61dafb" },
    { icon: "✓", text: "Accepted to E-Sports Platform", time: "4 days ago", color: "#4ade80" },
    { icon: "🚀", text: "Joined CoSync", time: "1 week ago", color: "#fb923c" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes checkIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        .section-card { background:rgba(12,8,32,0.8); border:1px solid rgba(139,92,246,0.1); border-radius:16px; padding:20px; margin-bottom:16px; }
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
            <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>Profile</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ background: "none", border: "1px solid rgba(139,92,246,0.15)", color: "#6b7280", cursor: "pointer" }}>
              ← Dashboard
            </button>
            <button onClick={handleSave}
              className="text-sm px-4 py-1.5 rounded-lg font-semibold transition-all duration-300"
              style={{ background: saved ? "rgba(74,222,128,0.15)" : "linear-gradient(135deg,#7c3aed,#6d28d9)", color: saved ? "#4ade80" : "#fff", border: saved ? "1px solid rgba(74,222,128,0.3)" : "none", cursor: "pointer" }}>
              {saved ? "✓ Saved!" : "Save changes"}
            </button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Profile hero */}
          <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: "rgba(12,8,32,0.9)", border: "1px solid rgba(139,92,246,0.15)", animation: "fadeUp 0.5s ease both" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(109,40,217,0.12) 0%, transparent 60%)" }} />
            <div className="relative flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff" }}>
                  {form.name[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "#4ade80", border: "2px solid #05030f" }}>✓</div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>{form.name}</h1>
                    <p style={{ color: "#a78bfa", fontSize: "0.9rem" }}>{form.role} · {form.university}</p>
                    <p className="text-sm mt-1" style={{ color: "#4b5563" }}>{form.degree}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                      ● {form.availability}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa" }}>
                      {form.experience}
                    </span>
                  </div>
                </div>

                <p className="text-sm mt-3 leading-relaxed" style={{ color: "#6b7280", maxWidth: 500 }}>{form.bio}</p>

                {/* Skills preview */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {form.skills.map((s, i) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: `${SKILL_COLORS[i % SKILL_COLORS.length]}12`, border: `1px solid ${SKILL_COLORS[i % SKILL_COLORS.length]}30`, color: SKILL_COLORS[i % SKILL_COLORS.length] }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match score ring */}
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42 * 0.87} ${2 * Math.PI * 42}`} />
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">87%</span>
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: "#4b5563" }}>Match Score</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-5 pt-5" style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}>
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "#374151" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs + content */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left — form */}
            <div className="lg:col-span-2">
              {/* Tab bar */}
              <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(12,8,32,0.8)", border: "1px solid rgba(139,92,246,0.1)" }}>
                {TABS.map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200"
                    style={{
                      background: activeTab === t ? "rgba(124,58,237,0.2)" : "transparent",
                      border: activeTab === t ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                      color: activeTab === t ? "#a78bfa" : "#4b5563",
                      cursor: "pointer",
                    }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Profile tab */}
              {activeTab === "profile" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="section-card">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Personal Info</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Full Name">
                        <TextInput value={form.name} onChange={set("name")} placeholder="Your full name" />
                      </Field>
                      <Field label="Email">
                        <TextInput value={form.email} onChange={set("email")} placeholder="you@example.com" type="email" />
                      </Field>
                    </div>
                    <Field label="Bio" hint={`${form.bio.length}/300`}>
                      <textarea value={form.bio} onChange={set("bio")} rows={3} maxLength={300}
                        placeholder="Tell the community about yourself..."
                        style={{ ...inputStyle(false, false), resize: "none" }} />
                    </Field>
                  </div>

                  <div className="section-card">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Academic Info</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="University">
                        <SelectInput value={form.university} onChange={set("university")} options={UNIVERSITIES} placeholder="Select university" />
                      </Field>
                      <Field label="Degree">
                        <SelectInput value={form.degree} onChange={set("degree")} options={DEGREES} placeholder="Select degree" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Primary Role">
                        <SelectInput value={form.role} onChange={set("role")} options={ROLES} placeholder="Your role" />
                      </Field>
                      <Field label="Experience Level">
                        <SelectInput value={form.experience} onChange={set("experience")} options={["Beginner", "Intermediate", "Advanced", "Expert"]} placeholder="Select level" />
                      </Field>
                    </div>
                    <Field label="Availability">
                      <div className="flex gap-2">
                        {["Available", "Busy", "Open to ideas"].map(a => (
                          <button key={a} type="button" onClick={() => setForm(p => ({ ...p, availability: a }))}
                            className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                            style={{
                              background: form.availability === a ? "rgba(124,58,237,0.18)" : "rgba(139,92,246,0.04)",
                              border: `1px solid ${form.availability === a ? "rgba(139,92,246,0.45)" : "rgba(139,92,246,0.1)"}`,
                              color: form.availability === a ? "#a78bfa" : "#4b5563",
                              cursor: "pointer",
                            }}>
                            {form.availability === a ? "✓ " : ""}{a}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>
              )}

              {/* Skills tab */}
              {activeTab === "skills" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="section-card">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Your Skills</p>
                    <Field label="Add Skills" hint={`${form.skills.length}/15`}>
                      <SkillTagInput skills={form.skills} setSkills={s => setForm(p => ({ ...p, skills: s }))} />
                    </Field>
                    <p className="text-xs mb-4" style={{ color: "#374151" }}>Quick add popular skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {["React","Vue","Angular","Node.js","Python","Django","FastAPI","PostgreSQL","MongoDB","Docker","AWS","Figma","Flutter","Swift","Kotlin"].filter(s => !form.skills.includes(s)).map((s, i) => (
                        <button key={s} type="button"
                          onClick={() => setForm(p => ({ ...p, skills: [...p.skills, s] }))}
                          className="text-xs px-2.5 py-1 rounded-lg transition-all duration-150"
                          style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)", color: "#4b5563", cursor: "pointer" }}
                          onMouseEnter={e => { e.currentTarget.style.color = SKILL_COLORS[i % SKILL_COLORS.length]; e.currentTarget.style.borderColor = `${SKILL_COLORS[i % SKILL_COLORS.length]}40`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)"; }}>
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Links tab */}
              {activeTab === "links" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="section-card">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Portfolio Links</p>
                    {[
                      { label: "GitHub", field: "github", placeholder: "https://github.com/username", icon: "⌥" },
                      { label: "LinkedIn", field: "linkedin", placeholder: "https://linkedin.com/in/username", icon: "🔗" },
                      { label: "Personal Website", field: "website", placeholder: "https://yourwebsite.com", icon: "🌐" },
                    ].map(({ label, field, placeholder, icon }) => (
                      <Field key={field} label={label}>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: "#4b5563" }}>{icon}</span>
                          <TextInput value={form[field]} onChange={set(field)} placeholder={placeholder} />
                        </div>
                      </Field>
                    ))}
                    <div className="rounded-xl p-4 mt-2" style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)" }}>
                      <p className="text-xs" style={{ color: "#4b5563" }}>
                        Profiles with portfolio links get <span style={{ color: "#a78bfa" }}>3× more</span> match opportunities from project leads.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity tab */}
              {activeTab === "activity" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="section-card">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Recent Activity</p>
                    <div className="space-y-4">
                      {ACTIVITY.map((a, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                            style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>{a.icon}</div>
                          <div>
                            <p className="text-sm text-white">{a.text}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right — sidebar */}
            <div className="space-y-4">
              {/* Profile completeness */}
              <div className="section-card">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Profile Strength</p>
                {[
                  { label: "Basic info", done: !!form.name && !!form.email },
                  { label: "Bio added", done: form.bio.length >= 20 },
                  { label: "University set", done: !!form.university },
                  { label: "Skills added", done: form.skills.length >= 3 },
                  { label: "GitHub linked", done: !!form.github },
                  { label: "LinkedIn linked", done: !!form.linkedin },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                      style={{ background: done ? "rgba(74,222,128,0.15)" : "rgba(139,92,246,0.08)", color: done ? "#4ade80" : "#374151", border: `1px solid ${done ? "rgba(74,222,128,0.3)" : "rgba(139,92,246,0.1)"}` }}>
                      {done ? "✓" : "·"}
                    </div>
                    <p className="text-xs" style={{ color: done ? "#6b7280" : "#374151", textDecoration: done ? "line-through" : "none" }}>{label}</p>
                  </div>
                ))}
                <div className="mt-3">
                  <div className="flex justify-between mb-1.5 text-xs" style={{ color: "#374151" }}>
                    <span>Completeness</span>
                    <span style={{ color: "#a78bfa" }}>
                      {Math.round(([!!form.name, !!form.email, form.bio.length >= 20, !!form.university, form.skills.length >= 3, !!form.github].filter(Boolean).length / 6) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(([!!form.name, !!form.email, form.bio.length >= 20, !!form.university, form.skills.length >= 3, !!form.github].filter(Boolean).length / 6) * 100)}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div className="section-card">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#374151" }}>Account</p>
                <button className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 mb-2"
                  style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.06)"}>
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;