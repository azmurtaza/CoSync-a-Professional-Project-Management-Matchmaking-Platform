import { useState, useMemo } from "react";
import {
  DndContext, DragOverlay, PointerSensor,
  useSensor, useSensors, closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import TaskCard    from "./TaskCard";
import AddTaskModal from "./AddTaskModal";

// ── Initial data ──────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  {
    id: 1, title: "Set up React project structure", status: "done",
    description: "Initialize Vite, install dependencies, set up folder structure.",
    type: "task", priority: "high",
    assignee: { id: 1, name: "Azaan Murtaza", color: "#7c3aed" },
    dueDate: "Apr 20", tags: ["setup"], checklist: [
      { text: "Install dependencies", done: true },
      { text: "Create folder structure", done: true },
    ], comments: 2,
  },
  {
    id: 2, title: "Design Chess board UI", status: "done",
    description: "Create responsive SVG chess board with piece rendering.",
    type: "design", priority: "high",
    assignee: { id: 2, name: "Sara Qureshi", color: "#a78bfa" },
    dueDate: "Apr 22", tags: ["UI", "chess"], checklist: [
      { text: "Board grid", done: true },
      { text: "Piece sprites", done: true },
      { text: "Dark/light squares", done: true },
    ], comments: 5,
  },
  {
    id: 3, title: "Implement minimax algorithm", status: "inprogress",
    description: "Build the core chess AI using minimax with alpha-beta pruning for better performance.",
    type: "feature", priority: "urgent",
    assignee: { id: 2, name: "Sara Qureshi", color: "#a78bfa" },
    dueDate: "May 2", tags: ["AI", "algorithm"], checklist: [
      { text: "Basic minimax", done: true },
      { text: "Alpha-beta pruning", done: false },
      { text: "Position evaluation", done: false },
    ], comments: 8,
  },
  {
    id: 4, title: "FastAPI backend setup", status: "inprogress",
    description: "Set up FastAPI with CORS, endpoints for move validation and game state.",
    type: "feature", priority: "high",
    assignee: { id: 3, name: "Ali Hassan", color: "#61dafb" },
    dueDate: "Apr 30", tags: ["backend", "API"], checklist: [
      { text: "Install FastAPI", done: true },
      { text: "Move validation endpoint", done: false },
    ], comments: 3,
  },
  {
    id: 5, title: "Fix castling bug", status: "inprogress",
    description: "Castling not working when king has previously moved. Need to track king move history.",
    type: "bug", priority: "urgent",
    assignee: { id: 1, name: "Azaan Murtaza", color: "#7c3aed" },
    dueDate: "Apr 28", tags: ["bug", "chess-rules"], checklist: [], comments: 4,
  },
  {
    id: 6, title: "Write API documentation", status: "review",
    description: "Document all FastAPI endpoints with request/response schemas.",
    type: "docs", priority: "medium",
    assignee: { id: 3, name: "Ali Hassan", color: "#61dafb" },
    dueDate: "May 5", tags: ["docs"], checklist: [
      { text: "Move endpoints", done: true },
      { text: "Game state endpoints", done: false },
    ], comments: 1,
  },
  {
    id: 7, title: "Add game timer feature", status: "todo",
    description: "Implement chess clock — blitz, rapid, and classical time controls.",
    type: "feature", priority: "medium",
    assignee: null, dueDate: "May 8", tags: ["feature", "UX"],
    checklist: [], comments: 0,
  },
  {
    id: 8, title: "Mobile responsive board", status: "todo",
    description: "Ensure chess board is fully playable on mobile with touch drag support.",
    type: "design", priority: "medium",
    assignee: { id: 2, name: "Sara Qureshi", color: "#a78bfa" },
    dueDate: "May 12", tags: ["mobile", "responsive"],
    checklist: [], comments: 2,
  },
  {
    id: 9, title: "Training data pipeline", status: "todo",
    description: "Set up data pipeline to feed chess games from Lichess API into PyTorch model.",
    type: "feature", priority: "high",
    assignee: { id: 2, name: "Sara Qureshi", color: "#a78bfa" },
    dueDate: "May 15", tags: ["ML", "data"],
    checklist: [
      { text: "Lichess API setup", done: false },
      { text: "Data preprocessing", done: false },
      { text: "PyTorch dataset class", done: false },
    ], comments: 0,
  },
  {
    id: 10, title: "Write unit tests", status: "todo",
    description: "Jest tests for move validation, game state, and API endpoints.",
    type: "task", priority: "low",
    assignee: null, dueDate: "May 18", tags: ["testing"],
    checklist: [], comments: 0,
  },
];

const COLUMNS = ["todo", "inprogress", "review", "done"];
const COLUMN_LABELS = { todo: "To Do", inprogress: "In Progress", review: "In Review", done: "Done" };

// ── Filters ───────────────────────────────────────────────────────────────────
const MEMBERS = [
  { id: 1, name: "Azaan Murtaza", color: "#7c3aed" },
  { id: 2, name: "Sara Qureshi",  color: "#a78bfa" },
  { id: 3, name: "Ali Hassan",    color: "#61dafb" },
];

const KanbanBoard = ({ workspaceTitle = "AI Chess Bot" }) => {
  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState(null);
  const [modal, setModal]           = useState(null); // { column, task? }
  const [search, setSearch]         = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterType, setFilterType]         = useState("all");
  const [searchFocused, setSearchFocused]   = useState(false);
  const [viewMode, setViewMode]             = useState("board"); // board | list

  // ── Sensors — require 5px movement to start drag ──
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ── Filtered tasks ────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => tasks.filter(t => {
    const matchSearch   = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchAssignee = filterAssignee === "all" || (filterAssignee === "unassigned" ? !t.assignee : t.assignee?.id?.toString() === filterAssignee);
    const matchType     = filterType === "all" || t.type === filterType;
    return matchSearch && matchPriority && matchAssignee && matchType;
  }), [tasks, search, filterPriority, filterAssignee, filterType]);

  const tasksByColumn = useMemo(() =>
    COLUMNS.reduce((acc, col) => ({
      ...acc,
      [col]: filteredTasks.filter(t => t.status === col),
    }), {}),
  [filteredTasks]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: tasks.length,
    done:  tasks.filter(t => t.status === "done").length,
    urgent: tasks.filter(t => t.priority === "urgent").length,
    mine:  tasks.filter(t => t.assignee?.id === 1).length,
  }), [tasks]);

  // ── dnd-kit handlers ──────────────────────────────────────────────────────
  const onDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId  = active.id;
    const overId    = over.id;
    const activeCol = tasks.find(t => t.id === activeId)?.status;
    const overCol   = COLUMNS.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status;
    if (!activeCol || !overCol || activeCol === overCol) return;

    setTasks(prev => prev.map(t =>
      t.id === activeId ? { ...t, status: overCol } : t
    ));
  };

  const onDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const activeId  = active.id;
    const overId    = over.id;
    const activeCol = tasks.find(t => t.id === activeId)?.status;
    const overCol   = COLUMNS.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status;
    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      const colTasks  = tasks.filter(t => t.status === activeCol);
      const oldIndex  = colTasks.findIndex(t => t.id === activeId);
      const newIndex  = colTasks.findIndex(t => t.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(colTasks, oldIndex, newIndex);
        setTasks(prev => [
          ...prev.filter(t => t.status !== activeCol),
          ...reordered,
        ]);
      }
    }
  };

  // ── Task CRUD ─────────────────────────────────────────────────────────────
  const handleSaveTask = (task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      return exists ? prev.map(t => t.id === task.id ? task : t) : [...prev, task];
    });
  };

  const handleDeleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const clearFilters = () => {
    setSearch(""); setFilterPriority("all"); setFilterAssignee("all"); setFilterType("all");
  };

  const hasFilters = search || filterPriority !== "all" || filterAssignee !== "all" || filterType !== "all";

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
        .filter-btn { padding:5px 12px; border-radius:8px; font-size:0.75rem; font-weight:500; cursor:pointer; transition:all 0.2s; border:none; font-family:inherit; white-space:nowrap; }
        .board-scroll::-webkit-scrollbar { height:4px; }
        .board-scroll::-webkit-scrollbar-track { background:rgba(139,92,246,0.05); }
        .board-scroll::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.2); border-radius:2px; }
      `}</style>

      <div className="flex flex-col h-full" style={{ background: "transparent" }}>

        {/* ── Board header ── */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(139,92,246,0.08)" }}>

          {/* Title row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 18 }}>⊞</span>
                <h2 className="text-xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Kanban Board</h2>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                  {workspaceTitle}
                </span>
              </div>
              <p className="text-xs" style={{ color: "#4b5563" }}>
                Drag tasks between columns to update status
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex p-0.5 rounded-lg" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)" }}>
                {["board", "list"].map(v => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200"
                    style={{
                      background: viewMode === v ? "rgba(124,58,237,0.2)" : "transparent",
                      border: viewMode === v ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                      color: viewMode === v ? "#a78bfa" : "#4b5563",
                      cursor: "pointer",
                    }}>
                    {v === "board" ? "⊞" : "☰"} {v}
                  </button>
                ))}
              </div>

              {/* Add task */}
              <button onClick={() => setModal({ column: "todo" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 20px rgba(124,58,237,0.4)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                + New Task
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-4">
            {[
              { label: "Total", value: stats.total, color: "#a78bfa" },
              { label: "Done", value: `${stats.done}/${stats.total}`, color: "#4ade80" },
              { label: "Urgent", value: stats.urgent, color: "#f87171" },
              { label: "My tasks", value: stats.mine, color: "#61dafb" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs" style={{ color: "#374151" }}>{s.label}</span>
              </div>
            ))}

            {/* Progress bar */}
            <div className="flex-1 flex items-center gap-2 ml-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%`, background: "linear-gradient(90deg,#7c3aed,#4ade80)" }} />
              </div>
              <span className="text-xs font-medium" style={{ color: "#4b5563" }}>
                {stats.total ? Math.round((stats.done / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm"
                style={{ color: searchFocused ? "#a78bfa" : "#374151", transition: "color 0.2s" }}>⌕</span>
              <input type="text" placeholder="Search tasks or tags..."
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                className="text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(12,8,32,0.85)", padding: "0.45rem 0.75rem 0.45rem 2rem",
                  border: `1px solid ${searchFocused ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`,
                  borderRadius: 8, width: 200,
                  boxShadow: searchFocused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
                }} />
            </div>

            {/* Priority filter */}
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="filter-btn"
              style={{ background: filterPriority !== "all" ? "rgba(124,58,237,0.15)" : "rgba(12,8,32,0.85)", border: `1px solid ${filterPriority !== "all" ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`, color: filterPriority !== "all" ? "#a78bfa" : "#4b5563", appearance: "none", padding: "5px 20px 5px 12px" }}>
              <option value="all" style={{ background: "#0a0520" }}>All priorities</option>
              <option value="urgent" style={{ background: "#0a0520" }}>🔴 Urgent</option>
              <option value="high" style={{ background: "#0a0520" }}>🟠 High</option>
              <option value="medium" style={{ background: "#0a0520" }}>🟡 Medium</option>
              <option value="low" style={{ background: "#0a0520" }}>🟢 Low</option>
            </select>

            {/* Type filter */}
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="filter-btn"
              style={{ background: filterType !== "all" ? "rgba(124,58,237,0.15)" : "rgba(12,8,32,0.85)", border: `1px solid ${filterType !== "all" ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.12)"}`, color: filterType !== "all" ? "#a78bfa" : "#4b5563", appearance: "none", padding: "5px 20px 5px 12px" }}>
              <option value="all" style={{ background: "#0a0520" }}>All types</option>
              <option value="feature" style={{ background: "#0a0520" }}>✦ Feature</option>
              <option value="bug" style={{ background: "#0a0520" }}>⚡ Bug</option>
              <option value="task" style={{ background: "#0a0520" }}>◈ Task</option>
              <option value="design" style={{ background: "#0a0520" }}>◉ Design</option>
              <option value="docs" style={{ background: "#0a0520" }}>◎ Docs</option>
            </select>

            {/* Assignee filter */}
            <div className="flex items-center gap-1">
              <button onClick={() => setFilterAssignee("all")}
                className="filter-btn"
                style={{ background: filterAssignee === "all" ? "rgba(124,58,237,0.15)" : "rgba(12,8,32,0.85)", border: `1px solid ${filterAssignee === "all" ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`, color: filterAssignee === "all" ? "#a78bfa" : "#4b5563" }}>
                All
              </button>
              {MEMBERS.map(m => (
                <button key={m.id} onClick={() => setFilterAssignee(filterAssignee === m.id.toString() ? "all" : m.id.toString())}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                  style={{
                    background: filterAssignee === m.id.toString() ? m.color + "30" : "rgba(12,8,32,0.85)",
                    border: `1.5px solid ${filterAssignee === m.id.toString() ? m.color : "rgba(139,92,246,0.1)"}`,
                    color: filterAssignee === m.id.toString() ? m.color : "#4b5563",
                    cursor: "pointer",
                  }} title={m.name}>
                  {m.name[0]}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button onClick={clearFilters}
                className="filter-btn transition-colors"
                style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                ✕ Clear
              </button>
            )}

            {hasFilters && (
              <span className="text-xs" style={{ color: "#374151" }}>
                Showing <span style={{ color: "#a78bfa" }}>{filteredTasks.length}</span> of {tasks.length}
              </span>
            )}
          </div>
        </div>

        {/* ── Board / List view ── */}
        {viewMode === "board" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <div className="flex-1 overflow-x-auto board-scroll">
              <div className="flex gap-4 p-6 h-full" style={{ minWidth: "max-content" }}>
                {COLUMNS.map((col, i) => (
                  <div key={col} style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.08}s` }}>
                    <KanbanColumn
                      id={col}
                      tasks={tasksByColumn[col] || []}
                      onAddTask={(column) => setModal({ column })}
                      onEditTask={(task) => setModal({ column: task.status, task })}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Drag overlay — the floating card while dragging */}
            <DragOverlay>
              {activeTask && (
                <div style={{ width: 300, transform: "rotate(2deg)" }}>
                  <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} overlay />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          /* ── List view ── */
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="max-w-4xl space-y-2">
              {COLUMNS.map(col => (
                <div key={col}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2 mt-4" style={{ color: "#374151" }}>
                    {COLUMN_LABELS[col]} ({tasksByColumn[col]?.length || 0})
                  </p>
                  {tasksByColumn[col]?.map((task, i) => (
                    <div key={task.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl mb-1.5 transition-all duration-200"
                      style={{ background: "rgba(12,8,32,0.8)", border: "1px solid rgba(139,92,246,0.1)", animation: `slideIn 0.3s ease both`, animationDelay: `${i * 0.04}s` }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.background = "rgba(20,12,50,0.9)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)"; e.currentTarget.style.background = "rgba(12,8,32,0.8)"; }}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", flexShrink: 0 }}>{task.type}</span>
                        <p className="text-white text-sm font-medium truncate">{task.title}</p>
                        {task.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full hidden md:block" style={{ background: "rgba(139,92,246,0.08)", color: "#4b5563", flexShrink: 0 }}>{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        {task.assignee && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: task.assignee.color + "30", color: task.assignee.color }}>
                            {task.assignee.name[0]}
                          </div>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-md" style={{
                          background: task.priority === "urgent" ? "rgba(248,113,113,0.1)" : task.priority === "high" ? "rgba(251,146,60,0.1)" : "rgba(251,191,36,0.1)",
                          color: task.priority === "urgent" ? "#f87171" : task.priority === "high" ? "#fb923c" : "#fbbf24",
                        }}>{task.priority}</span>
                        {task.dueDate && <span className="text-xs" style={{ color: "#374151" }}>{task.dueDate}</span>}
                        <button onClick={() => setModal({ column: task.status, task })}
                          className="text-xs px-2 py-1 rounded-lg transition-all duration-200"
                          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", color: "#a78bfa", cursor: "pointer" }}>
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit modal ── */}
      {modal && (
        <AddTaskModal
          onClose={() => setModal(null)}
          onSave={handleSaveTask}
          defaultColumn={modal.column}
          editTask={modal.task || null}
          columns={COLUMNS}
        />
      )}
    </>
  );
};

export default KanbanBoard;