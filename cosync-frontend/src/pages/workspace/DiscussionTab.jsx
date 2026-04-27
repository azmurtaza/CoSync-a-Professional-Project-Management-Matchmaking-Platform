import { useState, useRef, useEffect } from "react";

const MEMBERS = [
  { id: 1, name: "Azaan Murtaza", color: "#7c3aed", online: true  },
  { id: 2, name: "Sara Qureshi",  color: "#a78bfa", online: true  },
  { id: 3, name: "Ali Hassan",    color: "#61dafb", online: false },
];

const ME = MEMBERS[0];

const INITIAL_MESSAGES = [
  {
    id: 1, authorId: 2, text: "Hey team! I've pushed the initial board UI. Can someone review the piece rendering?",
    time: "Apr 20, 10:30 AM", reactions: [{ emoji: "👀", count: 2 }, { emoji: "✓", count: 1 }],
    replies: [
      { id: 11, authorId: 1, text: "Looks great Sara! The dark squares need a slightly different shade though.", time: "10:45 AM", reactions: [] },
      { id: 12, authorId: 3, text: "Agreed — maybe try #3d3d3d for dark squares?", time: "11:00 AM", reactions: [{ emoji: "💡", count: 1 }] },
    ],
  },
  {
    id: 2, authorId: 3, text: "FastAPI is set up and running on port 8000. Move validation endpoint is live — /api/validate-move",
    time: "Apr 21, 2:15 PM", reactions: [{ emoji: "🚀", count: 3 }],
    replies: [],
  },
  {
    id: 3, authorId: 1, text: "Heads up — I found a castling bug. King can castle even after it's moved. Working on a fix now.",
    time: "Apr 22, 9:00 AM", reactions: [{ emoji: "⚡", count: 1 }],
    replies: [
      { id: 31, authorId: 2, text: "I can help debug — want to pair on it?", time: "9:15 AM", reactions: [] },
    ],
  },
  {
    id: 4, authorId: 2, text: "Just pushed the minimax v1. Basic AI is working! It's slow but it plays legal moves 😅 Alpha-beta pruning next.",
    time: "Apr 23, 4:30 PM", reactions: [{ emoji: "🎉", count: 2 }, { emoji: "🔥", count: 1 }],
    replies: [],
  },
];

const EMOJI_OPTIONS = ["👍", "🔥", "🎉", "👀", "💡", "✓", "⚡", "🚀"];

const Avatar = ({ member, size = 8, showOnline = false }) => (
  <div className="relative flex-shrink-0">
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold`}
      style={{ background: member.color + "25", color: member.color, border: `1.5px solid ${member.color}40`, width: size * 4, height: size * 4, fontSize: size < 8 ? 10 : 12 }}
    >
      {member.name[0]}
    </div>
    {showOnline && (
      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
        style={{ background: member.online ? "#4ade80" : "#374151", borderColor: "#05030f" }} />
    )}
  </div>
);

const ReactionBar = ({ reactions, onReact }) => (
  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
    {reactions.map(r => (
      <button key={r.emoji} onClick={() => onReact(r.emoji)}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all duration-150"
        style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", color: "#9ca3af", cursor: "pointer" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.18)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.08)"; e.currentTarget.style.color = "#9ca3af"; }}>
        {r.emoji} <span style={{ color: "#6b7280" }}>{r.count}</span>
      </button>
    ))}
  </div>
);

const Message = ({ msg, onReact, onReply }) => {
  const author = MEMBERS.find(m => m.id === msg.authorId) || MEMBERS[0];
  const isMe = msg.authorId === ME.id;
  const [showReplies, setShowReplies] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex gap-3 group ${isMe ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowEmoji(false); }}
    >
      <Avatar member={author} size={8} />

      <div className={`flex-1 max-w-lg ${isMe ? "items-end" : "items-start"} flex flex-col`}>
        {/* Author + time */}
        <div className={`flex items-center gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-xs font-semibold" style={{ color: author.color }}>{author.name}</span>
          <span className="text-xs" style={{ color: "#374151" }}>{msg.time}</span>
        </div>

        {/* Bubble */}
        <div className="relative">
          <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
            style={{
              background: isMe ? "rgba(124,58,237,0.2)" : "rgba(15,10,40,0.85)",
              border: `1px solid ${isMe ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.12)"}`,
              color: "#e5e7eb",
              borderTopRightRadius: isMe ? 4 : 16,
              borderTopLeftRadius: isMe ? 16 : 4,
            }}>
            {msg.text}
          </div>

          {/* Hover actions */}
          {hovered && (
            <div
              className={`absolute top-0 flex items-center gap-1 ${isMe ? "right-full mr-2" : "left-full ml-2"}`}
              style={{ animation: "fadeIn 0.15s ease" }}>
              {/* Emoji picker */}
              <div className="relative">
                <button onClick={() => setShowEmoji(p => !p)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all duration-150"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", cursor: "pointer", color: "#6b7280" }}>
                  😊
                </button>
                {showEmoji && (
                  <div className="absolute bottom-8 left-0 flex gap-1 p-2 rounded-xl z-20"
                    style={{ background: "#0a0520", border: "1px solid rgba(139,92,246,0.25)", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
                    {EMOJI_OPTIONS.map(e => (
                      <button key={e} onClick={() => { onReact(msg.id, e); setShowEmoji(false); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-all duration-150"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e2 => e2.currentTarget.style.background = "rgba(139,92,246,0.15)"}
                        onMouseLeave={e2 => e2.currentTarget.style.background = "none"}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Reply */}
              <button onClick={() => onReply(msg.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-150"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", cursor: "pointer", color: "#6b7280" }}>
                ↩
              </button>
            </div>
          )}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <ReactionBar reactions={msg.reactions} onReact={(e) => onReact(msg.id, e)} />
        )}

        {/* Replies toggle */}
        {msg.replies.length > 0 && (
          <button onClick={() => setShowReplies(p => !p)}
            className="mt-1.5 text-xs flex items-center gap-1.5 transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa" }}
            onMouseEnter={e => e.currentTarget.style.color = "#c4b5fd"}
            onMouseLeave={e => e.currentTarget.style.color = "#a78bfa"}>
            <span className="text-xs">{showReplies ? "▾" : "▸"}</span>
            {msg.replies.length} {msg.replies.length === 1 ? "reply" : "replies"}
          </button>
        )}

        {/* Replies thread */}
        {showReplies && (
          <div className="mt-2 ml-4 space-y-2 pl-3" style={{ borderLeft: "2px solid rgba(139,92,246,0.15)" }}>
            {msg.replies.map(reply => {
              const replyAuthor = MEMBERS.find(m => m.id === reply.authorId) || MEMBERS[0];
              return (
                <div key={reply.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: replyAuthor.color + "25", color: replyAuthor.color }}>
                    {replyAuthor.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold" style={{ color: replyAuthor.color }}>{replyAuthor.name.split(" ")[0]}</span>
                      <span className="text-xs" style={{ color: "#374151" }}>{reply.time}</span>
                    </div>
                    <div className="rounded-xl px-3 py-2 text-xs leading-relaxed"
                      style={{ background: "rgba(15,10,40,0.7)", border: "1px solid rgba(139,92,246,0.1)", color: "#9ca3af" }}>
                      {reply.text}
                    </div>
                    {reply.reactions.length > 0 && (
                      <ReactionBar reactions={reply.reactions} onReact={() => {}} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const DiscussionTab = ({ workspace }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    if (replyingTo !== null) {
      setMessages(prev => prev.map(m =>
        m.id === replyingTo ? {
          ...m,
          replies: [...m.replies, {
            id: Date.now(), authorId: ME.id, text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            reactions: [],
          }],
        } : m
      ));
      setReplyingTo(null);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(), authorId: ME.id, text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reactions: [], replies: [],
      }]);
    }
    setInput("");
  };

  const handleReact = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions.find(r => r.emoji === emoji);
      return {
        ...m,
        reactions: existing
          ? m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
          : [...m.reactions, { emoji, count: 1 }],
      };
    }));
  };

  const replyingMsg = messages.find(m => m.id === replyingTo);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .chat-scroll::-webkit-scrollbar { width:3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.2); border-radius:2px; }
      `}</style>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Messages area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Team Discussion</h2>
                <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>
                  {messages.length} messages · {workspace?.members?.filter(m => m.online).length || 2} online
                </p>
              </div>
              <div className="flex -space-x-2">
                {MEMBERS.map(m => (
                  <div key={m.id} title={`${m.name} ${m.online ? "(online)" : "(offline)"}`}>
                    <Avatar member={m} size={7} showOnline />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 chat-scroll">
            {/* Date divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(139,92,246,0.1)" }} />
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.08)", color: "#374151", border: "1px solid rgba(139,92,246,0.1)" }}>
                Apr 20, 2026
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(139,92,246,0.1)" }} />
            </div>

            {messages.map(msg => (
              <div key={msg.id} style={{ animation: "slideUp 0.3s ease both" }}>
                <Message msg={msg} onReact={handleReact} onReply={setReplyingTo} />
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-6 pb-5 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}>
            {/* Reply indicator */}
            {replyingTo && replyingMsg && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-2"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#a78bfa", fontSize: 12 }}>↩</span>
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    Replying to <span style={{ color: "#a78bfa" }}>{MEMBERS.find(m => m.id === replyingMsg.authorId)?.name.split(" ")[0]}</span>
                    : "{replyingMsg.text.slice(0, 40)}..."
                  </span>
                </div>
                <button onClick={() => setReplyingTo(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", fontSize: 16 }}>×</button>
              </div>
            )}

            <div className="flex items-end gap-3">
              <Avatar member={ME} size={8} />
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Send a message... (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  className="w-full rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none transition-all duration-200"
                  style={{
                    background: "rgba(15,10,40,0.85)",
                    border: `1px solid ${inputFocused ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.15)"}`,
                    padding: "0.75rem 3rem 0.75rem 1rem",
                    boxShadow: inputFocused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
                    fontFamily: "inherit",
                  }}
                />
                <button onClick={send}
                  className="absolute right-3 bottom-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: input.trim() ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(139,92,246,0.08)",
                    border: "none", cursor: input.trim() ? "pointer" : "default",
                    color: input.trim() ? "#fff" : "#374151", fontSize: 13,
                  }}>
                  ↑
                </button>
              </div>
            </div>
            <p className="text-xs mt-2 ml-11" style={{ color: "#374151" }}>
              Enter to send · Shift+Enter for new line · Hover messages to react or reply
            </p>
          </div>
        </div>

        {/* ── Right sidebar — online members ── */}
        <div className="hidden xl:flex flex-col w-56 flex-shrink-0 p-4"
          style={{ borderLeft: "1px solid rgba(139,92,246,0.08)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Members</p>
          <div className="space-y-3">
            {MEMBERS.map(m => (
              <div key={m.id} className="flex items-center gap-2.5">
                <Avatar member={m} size={7} showOnline />
                <div>
                  <p className="text-xs font-medium text-white">{m.name.split(" ")[0]}</p>
                  <p className="text-xs" style={{ color: m.online ? "#4ade80" : "#374151" }}>
                    {m.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscussionTab;