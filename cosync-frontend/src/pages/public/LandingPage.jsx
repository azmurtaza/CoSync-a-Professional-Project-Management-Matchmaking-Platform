import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated grid background ──────────────────────────────────────────────────
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)",
      }}
    />
  </div>
);

// ── Floating orbs ─────────────────────────────────────────────────────────────
const Orbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute rounded-full"
      style={{
        width: 600,
        height: 600,
        top: "-200px",
        left: "-100px",
        background:
          "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
        animation: "floatA 12s ease-in-out infinite",
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: 500,
        height: 500,
        top: "10%",
        right: "-150px",
        background:
          "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)",
        animation: "floatB 15s ease-in-out infinite",
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: 400,
        height: 400,
        bottom: "5%",
        left: "30%",
        background:
          "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
        animation: "floatC 18s ease-in-out infinite",
      }}
    />
  </div>
);

// ── Typewriter hook ───────────────────────────────────────────────────────────
const useTypewriter = (words, speed = 100, pause = 2000) => {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
};

// ── Skill pill ────────────────────────────────────────────────────────────────
const Pill = ({ label, color }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
    style={{
      background: `${color}18`,
      borderColor: `${color}40`,
      color: color,
    }}
  >
    <span
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: color }}
    />
    {label}
  </span>
);

// ── Animated project card (hero visual) ──────────────────────────────────────
const HeroCard = ({ title, roles, delay }) => (
  <div
    className="rounded-xl border p-4 backdrop-blur-sm"
    style={{
      background: "rgba(15,10,40,0.7)",
      borderColor: "rgba(139,92,246,0.2)",
      animation: `cardFloat 6s ease-in-out infinite`,
      animationDelay: delay,
      minWidth: 260,
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-white text-sm font-semibold">{title}</p>
        <p className="text-purple-400 text-xs mt-0.5">Open for applications</p>
      </div>
      <span
        className="text-xs px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(34,197,94,0.15)",
          color: "#4ade80",
          border: "1px solid rgba(34,197,94,0.3)",
        }}
      >
        Active
      </span>
    </div>
    <div className="flex flex-wrap gap-1.5 mb-3">
      {roles.map((r) => (
        <Pill key={r.label} {...r} />
      ))}
    </div>
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-[#0a0520]"
            style={{
              background: `hsl(${260 + i * 30},70%,60%)`,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">3 applicants</span>
    </div>
  </div>
);

// ── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay }) => (
  <div
    className="group relative rounded-2xl border p-6 transition-all duration-300 hover:border-purple-500/40"
    style={{
      background: "rgba(15,10,40,0.5)",
      borderColor: "rgba(139,92,246,0.15)",
      animation: `fadeUp 0.6s ease both`,
      animationDelay: delay,
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
      style={{ background: "rgba(139,92,246,0.15)" }}
    >
      {icon}
    </div>
    <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    <div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)",
      }}
    />
  </div>
);

// ── Stat ──────────────────────────────────────────────────────────────────────
const Stat = ({ value, label }) => (
  <div className="text-center">
    <p
      className="text-3xl font-bold mb-1"
      style={{
        background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {value}
    </p>
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

// ── Main Landing Page ─────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const typed = useTypewriter(
    ["Hackathons", "Startups", "Research", "Open Source", "FYPs"],
    80,
    1800
  );

  return (
    <>
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.05); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(0.97); }
        }
        @keyframes floatC {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px,-20px); }
        }
        @keyframes cardFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .cursor-blink::after {
          content: '|';
          animation: blink 1s step-end infinite;
          color: #a78bfa;
          margin-left: 2px;
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        .nav-link {
          color: #9ca3af;
          font-size: 0.875rem;
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link:hover { color: #fff; }
        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          border: none;
          padding: 0.625rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(124,58,237,0.35);
        }
        .btn-secondary {
          background: transparent;
          color: #d1d5db;
          border: 1px solid rgba(139,92,246,0.3);
          padding: 0.625rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: rgba(139,92,246,0.6);
          color: #fff;
          background: rgba(139,92,246,0.08);
        }
        .btn-hero {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 0.625rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .btn-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(124,58,237,0.4);
        }
        .btn-ghost {
          background: transparent;
          color: #9ca3af;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.875rem 2rem;
          border-radius: 0.625rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
        }
        .btn-ghost:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.25);
        }
      `}</style>

      <div
        className="min-h-screen relative"
        style={{ background: "#05030f", color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <GridBackground />
        <Orbs />

        {/* ── Navbar ── */}
        <nav
          className="relative z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto"
          style={{ animation: "slideDown 0.5s ease both" }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/cosync_logo.jpeg"
              alt="CoSync Logo"
              className="w-7 h-7 rounded-lg object-contain"
            />
            <span className="font-semibold text-white tracking-tight">CoSync</span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            <a href="/feed" className="nav-link">Projects</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How it works</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button className="btn-primary" onClick={() => navigate("/register")}>
              Get started
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div style={{ animation: "fadeUp 0.7s ease both", animationDelay: "0.1s" }}>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#a78bfa",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#a78bfa",
                    boxShadow: "0 0 6px #a78bfa",
                    animation: "pulse-ring 1.5s ease-out infinite",
                  }}
                />
                Now in beta — NUST SEECS
              </div>

              <h1
                className="text-5xl lg:text-6xl font-bold leading-tight mb-4"
                style={{ letterSpacing: "-0.03em" }}
              >
                Build teams for
                <br />
                <span
                  className="cursor-blink"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c084fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {typed || "\u00a0"}
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                Post your project, find the right collaborators by skill, and manage
                your team — all in one workspace.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <button className="btn-hero" onClick={() => navigate("/register")}>
                  Start a project
                </button>
                <button className="btn-ghost" onClick={() => navigate("/feed")}>
                  Browse projects →
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2">
                  {["#7c3aed","#8b5cf6","#6d28d9","#a78bfa"].map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2"
                      style={{ background: c, borderColor: "#05030f" }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-white font-medium">120+</span> students already building
                </p>
              </div>
            </div>

            {/* Right — floating cards */}
            <div
              className="relative hidden lg:block"
              style={{ height: 420, animation: "fadeIn 1s ease both", animationDelay: "0.4s" }}
            >
              <div className="absolute top-0 right-0">
                <HeroCard
                  title="AI Chess Bot"
                  delay="0s"
                  roles={[
                    { label: "React", color: "#61dafb" },
                    { label: "Python", color: "#4ade80" },
                  ]}
                />
              </div>
              <div className="absolute top-32 left-0">
                <HeroCard
                  title="Campus Ride Share"
                  delay="2s"
                  roles={[
                    { label: "Node.js", color: "#a78bfa" },
                    { label: "MongoDB", color: "#4ade80" },
                  ]}
                />
              </div>
              <div className="absolute bottom-0 right-8">
                <HeroCard
                  title="ML Research Paper"
                  delay="4s"
                  roles={[
                    { label: "PyTorch", color: "#fb923c" },
                    { label: "FastAPI", color: "#34d399" },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section
          className="relative z-10 max-w-3xl mx-auto px-6 mb-24"
          style={{ animation: "fadeUp 0.7s ease both", animationDelay: "0.5s" }}
        >
          <div
            className="rounded-2xl border p-8 grid grid-cols-3 gap-8"
            style={{
              background: "rgba(15,10,40,0.6)",
              borderColor: "rgba(139,92,246,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Stat value="120+" label="Students" />
            <Stat value="40+" label="Projects posted" />
            <Stat value="15+" label="Teams formed" />
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center mb-12" style={{ animation: "fadeUp 0.6s ease both" }}>
            <p className="text-purple-400 text-sm font-medium mb-2 uppercase tracking-widest">
              Everything you need
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ letterSpacing: "-0.02em" }}
            >
              From idea to shipped product
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon="🎯"
              title="Skill-based matchmaking"
              desc="Post what roles you need — React dev, ML engineer, designer. Our engine surfaces the best matches automatically."
              delay="0.1s"
            />
            <FeatureCard
              icon="📋"
              title="Kanban workspace"
              desc="Drag-and-drop task management built right in. To-do, In Progress, Done — your team stays in sync."
              delay="0.2s"
            />
            <FeatureCard
              icon="💬"
              title="Team discussions"
              desc="Threaded conversations per workspace. No need for a separate Slack — everything lives in CoSync."
              delay="0.3s"
            />
            <FeatureCard
              icon="⚡"
              title="Real-time updates"
              desc="When someone moves a task or posts a message, everyone sees it instantly. No refresh required."
              delay="0.4s"
            />
            <FeatureCard
              icon="📁"
              title="Resource repository"
              desc="Store your mocks, docs, and assets in one place. Every team member has instant access."
              delay="0.5s"
            />
            <FeatureCard
              icon="🏆"
              title="Reputation system"
              desc="Complete projects, earn trust scores. Build a track record that speaks louder than a resume."
              delay="0.6s"
            />
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="relative z-10 max-w-4xl mx-auto px-6 mb-24">
          <div className="text-center mb-12">
            <p className="text-purple-400 text-sm font-medium mb-2 uppercase tracking-widest">
              How it works
            </p>
            <h2 className="text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              Three steps to your team
            </h2>
          </div>

          <div className="relative">
            {/* connector line */}
            <div
              className="absolute left-6 top-8 bottom-8 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.4), transparent)" }}
            />

            {[
              { step: "01", title: "Post your project", desc: "Describe your idea, specify the tech stack, and list the roles you need filled." },
              { step: "02", title: "Match with collaborators", desc: "Students with matching skills discover your project and apply to join your team." },
              { step: "03", title: "Build together", desc: "Accept applications, unlock your private workspace, and ship your project." },
            ].map(({ step, title, desc }, i) => (
              <div
                key={step}
                className="flex gap-6 mb-8"
                style={{ animation: "fadeUp 0.6s ease both", animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#a78bfa",
                  }}
                >
                  {step}
                </div>
                <div className="pt-2">
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 mb-24">
          <div
            className="rounded-2xl p-12 text-center relative overflow-hidden"
            style={{
              background: "rgba(15,10,40,0.8)",
              border: "1px solid rgba(139,92,246,0.25)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(109,40,217,0.2) 0%, transparent 70%)",
              }}
            />
            <h2
              className="text-3xl font-bold mb-4 relative"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ready to find your team?
            </h2>
            <p className="text-gray-400 mb-8 relative">
              Join CoSync and turn your ideas into real projects.
            </p>
            <div className="flex items-center justify-center gap-4 relative">
              <button className="btn-hero" onClick={() => navigate("/register")}>
                Create your account
              </button>
              <button className="btn-ghost" onClick={() => navigate("/feed")}>
                Browse first
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="relative z-10 border-t px-6 py-8 max-w-6xl mx-auto"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/cosync_logo.jpeg"
                alt="CoSync Logo"
                className="w-5 h-5 rounded object-contain"
              />
              <span className="text-sm text-gray-500">CoSync — CS-236 Web Technologies, NUST</span>
            </div>
            <div className="flex gap-6">
              <a href="/feed" className="nav-link text-xs">Projects</a>
              <a href="/login" className="nav-link text-xs">Sign in</a>
              <a href="/register" className="nav-link text-xs">Register</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;