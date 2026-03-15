import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";
import {
  FiHome, FiInbox, FiCalendar, FiSettings, FiHelpCircle, FiSearch,
  FiBell, FiChevronLeft, FiFilter, FiList, FiGrid, FiClock,
  FiMoreHorizontal, FiMoreVertical, FiPlus, FiUserPlus, FiShare2,
  FiLayout, FiLayers, FiMessageSquare, FiLink, FiCheckSquare,
  FiChevronRight, FiX, FiStar, FiDownload, FiFileText, FiUsers,
  FiLogOut, FiEdit2, FiTrash2, FiAlertTriangle, FiUser, FiMail,
  FiShield, FiSave
} from "react-icons/fi";
 
// ── Color palette for avatars
const AVATAR_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899','#8b5cf6','#14b8a6'];
const API = 'http://localhost:5000';
const PRIORITY_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#6366f1" };
const STATUS_CONFIG = {
  "Not Started": { color: "#6366f1", bg: "#EEF2FF" },
  "In Progress":  { color: "#f59e0b", bg: "#FFF7ED" },
  "Done":         { color: "#10b981", bg: "#D1FAE5" },
};
 
// ── Helper: get initials from name
const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
};
 
// ── CharacterAvatar
const CharacterAvatar = ({ member, size = "24px", fontSize = "10px", style = {} }) => (
  <div
    title={member?.name}
    style={{
      width: size, height: size, borderRadius: "50%",
      backgroundColor: member?.color || "#6366f1", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: "bold", border: "2px solid #fff",
      flexShrink: 0, ...style
    }}
  >
    {member?.initial || getInitials(member?.name || '?')}
  </div>
);
 
// ── TaskCard (Board view card)
const TaskCard = ({ task, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
    <div className="card-header-top">
      <span className="status-label" style={{ color: task.statusColor, background: `${task.statusColor}15` }}>
        ● {task.status}
      </span>
      <FiMoreHorizontal className="dots-icon" />
    </div>
    <h4 className="card-title">{task.title}</h4>
    <p className="card-desc">{(task.description || '').substring(0, 45)}{task.description?.length > 45 ? '...' : ''}</p>
    <div className="card-assignees">
      <span>Assignees:</span>
      <div className="card-avatars" style={{ display: "flex", marginLeft: "8px" }}>
        {task.assigneesList && task.assigneesList.length > 0 ? (
          task.assigneesList.map((member, idx) => (
            <CharacterAvatar key={member.id || member._id} member={member} style={{ marginLeft: idx === 0 ? "0" : "-8px" }} />
          ))
        ) : (
          <span style={{ fontSize: '10px', color: '#999' }}>None</span>
        )}
      </div>
    </div>
    <div className="card-mid">
      <div className="card-date"><FiCalendar size={12} /> {task.dueDate || 'No date'}</div>
      <span className="priority-badge" style={{ color: task.priorityColor, background: `${task.priorityColor}15` }}>
        {task.priority}
      </span>
    </div>
    <div className="card-footer">
      <span><FiMessageSquare size={12} /> {task.comments?.length || 0} Comments</span>
      <span><FiLink size={12} /> 1 Links</span>
      <span><FiCheckSquare size={12} /> 0/3</span>
    </div>
  </div>
);
 
// ════════════════════════════════════════════════════
// ── List View
// ════════════════════════════════════════════════════
function ListView({ tasks, onTaskClick }) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #f0f0f2", background: "#fafafa" }}>
            {["STATUS", "TASK NAME", "ASSIGNEE", "DUE DATE", "PRIORITY", ""].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#aaa", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: "60px", color: "#bbb", fontSize: "14px" }}>
              No tasks yet. Click "+ New Task" to create one!
            </td></tr>
          ) : tasks.map(task => {
            const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG["Not Started"];
            return (
              <tr key={task._id || task.id} onClick={() => onTaskClick(task)}
                style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "16px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", color: sc.color, fontWeight: "600", fontSize: "13px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.color, display: "inline-block", flexShrink: 0 }} />
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: "16px", minWidth: "260px" }}>
                  <div style={{ fontWeight: "600", fontSize: "15px", color: "#111" }}>{task.title}</div>
                  {task.description && <div style={{ fontSize: "13px", color: "#888", marginTop: "3px" }}>{task.description.substring(0, 60)}</div>}
                  {task.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                      {task.tags.map(tag => (
                        <span key={tag} style={{ background: "#EEF2FF", color: "#6366f1", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex" }}>
                    {task.assigneesList?.length > 0
                      ? task.assigneesList.map((m, i) => <CharacterAvatar key={m.id} member={m} size="32px" fontSize="12px" style={{ marginLeft: i === 0 ? 0 : "-8px" }} />)
                      : <span style={{ color: "#ccc", fontSize: "13px" }}>—</span>}
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555" }}>
                    <FiCalendar size={13} color="#aaa" /> {task.dueDate || '—'}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <span style={{ background: `${task.priorityColor}20`, color: task.priorityColor, padding: "4px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: "16px" }}><FiMoreHorizontal color="#bbb" style={{ cursor: "pointer" }} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
 
// ════════════════════════════════════════════════════
// ── Table View
// ════════════════════════════════════════════════════
function TableView({ tasks, onTaskClick }) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "2px solid #f0f0f2" }}>
            {["TASK TITLE", "STATUS", "PRIORITY", "ASSIGNEES", "DUE DATE"].map(h => (
              <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#aaa", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#bbb", fontSize: "14px" }}>No tasks yet.</td></tr>
          ) : tasks.map(task => {
            const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG["Not Started"];
            return (
              <tr key={task._id || task.id} onClick={() => onTaskClick(task)}
                style={{ borderBottom: "1px solid #f0f0f2", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "16px 20px", fontWeight: "600", fontSize: "15px", color: "#111" }}>{task.title}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ background: sc.bg, color: sc.color, padding: "4px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>{task.status}</span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ background: `${task.priorityColor}20`, color: task.priorityColor, padding: "4px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>{task.priority}</span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex" }}>
                    {task.assigneesList?.length > 0
                      ? task.assigneesList.map((m, i) => <CharacterAvatar key={m.id} member={m} size="32px" fontSize="12px" style={{ marginLeft: i === 0 ? 0 : "-8px" }} />)
                      : <span style={{ color: "#ccc", fontSize: "13px" }}>—</span>}
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: "13px", color: "#555" }}>{task.dueDate || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
 
// ════════════════════════════════════════════════════
// ── Overview Page
// ════════════════════════════════════════════════════
function OverviewPage({ tasks }) {
  const totalTasks = tasks.length;
  const doneTasks  = tasks.filter(t => t.status === "Done").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const todoTasks  = tasks.filter(t => t.status === "Not Started").length;
  const rate       = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const radius     = 54, circ = 2 * Math.PI * radius;
  const offset     = circ - (rate / 100) * circ;
 
  // ── helper: parse dueDate string → { month, day }
  const parseDue = (dueStr) => {
    if (!dueStr) return null;
    const d = new Date(dueStr);
    if (isNaN(d)) return null;
    return {
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day:   d.getDate(),
      isExpired: d < new Date(),
    };
  };
 
  // ── build recent activity entries from tasks
  const recentActivities = [];
  tasks.slice(0, 5).forEach(task => {
    recentActivities.push({
      id:      task._id || task.id,
      user:    task.createdBy || 'User',
      action:  'created',
      subject: task.title,
      time:    task.created || (task.createdAt ? new Date(task.createdAt).toLocaleString() : ''),
      dot:     task.statusColor || '#6366f1',
    });
    if (task.assigneesList?.length > 0) {
      recentActivities.push({
        id:      (task._id || task.id) + '-assign',
        user:    task.createdBy || 'User',
        action:  'assigned',
        subject: task.assigneesList[0].name,
        taskRef: task.title,
        time:    task.created || (task.createdAt ? new Date(task.createdAt).toLocaleString() : ''),
        dot:     '#6366f1',
        highlight: true,
      });
    }
    if (task.comments?.length > 0) {
      recentActivities.push({
        id:      (task._id || task.id) + '-comment',
        user:    task.createdBy || 'User',
        action:  'added a comment',
        subject: task.comments[task.comments.length - 1].text?.substring(0, 20) || '',
        taskRef: task.title,
        time:    task.comments[task.comments.length - 1].time || '',
        dot:     '#888',
        highlight: true,
      });
    }
  });
 
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" }}>
 
      {/* ── Top Row: 3 cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
 
        {/* Total Tasks */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ background: "#EEF2FF", padding: "10px", borderRadius: "12px" }}>
              <FiGrid size={20} color="#6366f1" />
            </div>
            <span style={{ fontSize: "12px", color: "#10b981", background: "#d1fae5", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px" }}>
              ↗ +12%
            </span>
          </div>
          <div style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "42px", fontWeight: "800", margin: 0, color: "#111", lineHeight: 1 }}>{totalTasks}</h2>
            <p style={{ color: "#888", margin: "6px 0 0", fontSize: "14px" }}>Total Tasks</p>
          </div>
        </div>
 
        {/* Completion Rate */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h4 style={{ margin: "0 0 12px", alignSelf: "flex-start", fontSize: "15px", fontWeight: "700", color: "#111" }}>Completion Rate</h4>
          <div style={{ position: "relative", width: "140px", height: "140px" }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="13" />
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#6366f1" strokeWidth="13"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#111", lineHeight: 1 }}>{rate}%</div>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#888", margin: "10px 0 0" }}>Average Performance</p>
        </div>
 
        {/* Task Distribution */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h4 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: "700", color: "#111" }}>Task Distribution</h4>
          {[
            { label: "To Do",       count: todoTasks,  color: "#f59e0b" },
            { label: "In Progress", count: inProgress, color: "#6366f1" },
            { label: "Done",        count: doneTasks,  color: "#10b981" },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", fontSize: "13px" }}>
                <span style={{ color: "#444", fontWeight: "500" }}>{label}</span>
                <span style={{ color: "#888", fontWeight: "500" }}>{count} Tasks</span>
              </div>
              <div style={{ background: "#f0f0f2", borderRadius: "999px", height: "7px" }}>
                <div style={{ width: totalTasks > 0 ? `${(count / totalTasks) * 100}%` : "0%", background: color, height: "100%", borderRadius: "999px", transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── Bottom Row: Upcoming Deadlines + Recent Activity ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
 
        {/* Upcoming Deadlines */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#111" }}>Upcoming Deadlines</h4>
            <span style={{ color: "#6366f1", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>View All</span>
          </div>
 
          {tasks.filter(t => t.dueDate).length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "40px 0", fontSize: "14px" }}>No upcoming deadlines found.</div>
          ) : (
            tasks.filter(t => t.dueDate).slice(0, 4).map(task => {
              const due = parseDue(task.dueDate);
              return (
                <div key={task._id || task.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 0", borderBottom: "1px solid #f5f5f7" }}>
                  {/* Date box */}
                  {due ? (
                    <div style={{ minWidth: "52px", background: due.isExpired ? "#fff0f0" : "#fff8f0", borderRadius: "12px", padding: "8px 0", textAlign: "center", border: `1px solid ${due.isExpired ? "#fecaca" : "#fed7aa"}` }}>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: due.isExpired ? "#ef4444" : "#f59e0b", letterSpacing: "0.5px" }}>{due.month}</div>
                      <div style={{ fontSize: "20px", fontWeight: "800", color: due.isExpired ? "#ef4444" : "#f59e0b", lineHeight: 1.1 }}>{due.day}</div>
                    </div>
                  ) : (
                    <div style={{ minWidth: "52px", background: "#f4f4f5", borderRadius: "12px", padding: "8px 0", textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#aaa" }}>—</div>
                    </div>
                  )}
                  {/* Task info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</p>
                    <small style={{ color: "#aaa", fontSize: "12px" }}>{(task.description || '').substring(0, 30)}{task.description?.length > 30 ? '...' : ''}</small>
                  </div>
                  {/* Priority + expired badge */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    {due?.isExpired && (
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#ef4444", background: "#fff0f0", padding: "2px 8px", borderRadius: "20px", border: "1px solid #fecaca" }}>Expired</span>
                    )}
                    <span style={{ fontSize: "11px", fontWeight: "700", color: task.priorityColor, background: `${task.priorityColor}15`, padding: "3px 10px", borderRadius: "20px" }}>
                      {task.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
 
        {/* Recent Activity */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#111" }}>Recent Activity</h4>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <FiClock size={14} color="#888" />
            </div>
          </div>
 
          {recentActivities.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "40px 0", fontSize: "14px" }}>No recent activity found.</div>
          ) : (
            recentActivities.slice(0, 5).map((act, i) => (
              <div key={act.id + i} style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "flex-start" }}>
                {/* Dot */}
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: act.dot, marginTop: "4px", flexShrink: 0, border: `2px solid ${act.dot}33` }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#333", lineHeight: 1.5 }}>
                    <strong style={{ color: "#111" }}>{act.user}</strong>
                    {' '}{act.action}{' '}
                    {act.highlight
                      ? <strong style={{ color: "#6366f1", cursor: "pointer" }}>{act.subject}</strong>
                      : <strong style={{ color: "#111" }}>"{act.subject}"</strong>}
                    {act.taskRef && <span style={{ color: "#aaa" }}> • {act.taskRef}</span>}
                  </p>
                  <small style={{ color: "#bbb", fontSize: "11px" }}>{act.time}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
 
// ════════════════════════════════════════════════════
// ── Profile Page
// ════════════════════════════════════════════════════
function ProfilePage({ user, onLogout }) {
  const [isEditing, setIsEditing]   = useState(false);
  const [isSaving,  setIsSaving]    = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saveMsg,   setSaveMsg]     = useState('');
 
  const [profileData, setProfileData] = useState({
    name:       user?.name      || '',
    email:      user?.email     || '',
    joinedDate: user?.joinedDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    accuracy:   'Verified Professional',
    role:       'Platform Administrator',
  });
  const [editData, setEditData] = useState({ ...profileData });
 
  const initial     = profileData.name?.charAt(0).toUpperCase() || 'U';
  const avatarColor = AVATAR_COLORS[profileData.name?.charCodeAt(0) % AVATAR_COLORS.length] || '#6366f1';
 
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setProfileData({ ...editData });
    setIsEditing(false);
    setIsSaving(false);
    setSaveMsg('✅ Profile updated successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  };
 
  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };
 
  return (
    <div style={{ padding: "32px", maxWidth: "860px", overflowY: "auto", height: "100%" }}>
 
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "700", margin: 0 }}>My Profile</h2>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "4px" }}>Manage your personal information</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {isEditing ? (
            <>
              <button onClick={handleCancel} style={{ background: "#fff", color: "#666", border: "1px solid #e0e0e0", padding: "10px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                <FiSave size={15} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ background: "#111", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <FiEdit2 size={15} /> Edit Profile
            </button>
          )}
        </div>
      </div>
 
      {/* Success message */}
      {saveMsg && (
        <div style={{ background: "#d1fae5", color: "#10b981", padding: "12px 20px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
          {saveMsg}
        </div>
      )}
 
      {/* Profile Card */}
      <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
 
        {/* Avatar + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px", paddingBottom: "28px", borderBottom: "1px solid #f5f5f5" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: avatarColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: "700", flexShrink: 0 }}>
            {initial}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>{profileData.name}</h3>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>{profileData.role}</p>
            <span style={{ display: "inline-block", marginTop: "8px", background: "#EEF2FF", color: "#6366f1", fontSize: "12px", fontWeight: "600", padding: "3px 12px", borderRadius: "20px" }}>
              ✓ {profileData.accuracy}
            </span>
          </div>
        </div>
 
        {/* Fields Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Full Name */}
          <div>
            <label style={{ fontSize: "11px", color: "#aaa", fontWeight: "700", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase" }}>
              <FiUser size={12} /> Full Name
            </label>
            <input value={isEditing ? editData.name : profileData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })} readOnly={!isEditing}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: isEditing ? "1.5px solid #6366f1" : "1.5px solid #f0f0f0", background: isEditing ? "#fafbff" : "#fafafa", fontSize: "14px", color: "#111", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
          </div>
          {/* Email */}
          <div>
            <label style={{ fontSize: "11px", color: "#aaa", fontWeight: "700", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase" }}>
              <FiMail size={12} /> Email Address
            </label>
            <input value={isEditing ? editData.email : profileData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })} readOnly={!isEditing}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: isEditing ? "1.5px solid #6366f1" : "1.5px solid #f0f0f0", background: isEditing ? "#fafbff" : "#fafafa", fontSize: "14px", color: "#111", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
          </div>
          {/* Joined Date */}
          <div>
            <label style={{ fontSize: "11px", color: "#aaa", fontWeight: "700", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase" }}>
              <FiCalendar size={12} /> Joined Date
            </label>
            <input value={profileData.joinedDate} readOnly
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #f0f0f0", background: "#fafafa", fontSize: "14px", color: "#888", outline: "none", boxSizing: "border-box", cursor: "default" }} />
          </div>
          {/* Account Status */}
          <div>
            <label style={{ fontSize: "11px", color: "#aaa", fontWeight: "700", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase" }}>
              <FiShield size={12} /> Account Status
            </label>
            <input value={profileData.accuracy} readOnly
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #f0f0f0", background: "#fafafa", fontSize: "14px", color: "#888", outline: "none", boxSizing: "border-box", cursor: "default" }} />
          </div>
          {/* Role */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "11px", color: "#aaa", fontWeight: "700", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase" }}>
              <FiUsers size={12} /> Role
            </label>
            <input value={isEditing ? editData.role : profileData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })} readOnly={!isEditing}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: isEditing ? "1.5px solid #6366f1" : "1.5px solid #f0f0f0", background: isEditing ? "#fafbff" : "#fafafa", fontSize: "14px", color: "#111", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
          </div>
        </div>
      </div>
 
      {/* Delete Account */}
      <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1.5px solid #fee2e2", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <FiAlertTriangle color="#ef4444" size={18} />
          <h4 style={{ margin: 0, color: "#ef4444", fontSize: "16px", fontWeight: "700" }}>Delete My Account</h4>
        </div>
        <p style={{ color: "#999", fontSize: "13px", margin: "0 0 20px", lineHeight: "1.6" }}>
          Deleting your account will permanently remove all your data and access. This action cannot be reversed.
        </p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} style={{ background: "#fff", color: "#ef4444", border: "1.5px solid #ef4444", padding: "10px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <FiTrash2 size={15} /> Delete Account
          </button>
        ) : (
          <div style={{ background: "#fff5f5", padding: "16px", borderRadius: "12px", border: "1px solid #fecaca" }}>
            <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: "600", margin: "0 0 12px" }}>Are you sure? This cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={onLogout} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>Yes, Delete</button>
              <button onClick={() => setShowDelete(false)} style={{ background: "#fff", color: "#666", border: "1px solid #e0e0e0", padding: "10px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
// ════════════════════════════════════════════════════
// ── Main Dashboard
// ════════════════════════════════════════════════════
function DashboardApp({ user, onLogout }) {
  const [activeMenu,         setActiveMenu]         = useState("Tasks");
  const [activeTab,          setActiveTab]          = useState("Board");
  const [searchQuery,        setSearchQuery]        = useState("");
  const [filterPriority,     setFilterPriority]     = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [showModal,          setShowModal]          = useState(false);
  const [activeDetailTab,    setActiveDetailTab]    = useState("Activity");
  const [commentText,        setCommentText]        = useState("");
  const [selectedTask,       setSelectedTask]       = useState(null);
 
  // DB state
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [allTasks,          setAllTasks]          = useState([]);
  const [loading,           setLoading]           = useState(true);
 
  // New task form
  const [newTaskTitle,       setNewTaskTitle]       = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority,    setNewTaskPriority]    = useState("Medium");
  const [newTaskDueDate,     setNewTaskDueDate]     = useState("");
  const [newTaskTags,        setNewTaskTags]        = useState("");
 
  const userInitial    = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const userColor      = AVATAR_COLORS[(user?.name || '').charCodeAt(0) % AVATAR_COLORS.length] || '#6366f1';
  const loggedInMember = { id: 'logged-in', name: user?.name || 'User', email: user?.email || '', initial: userInitial, color: userColor };
 
  // ── Fetch tasks + users from DB on mount
  useEffect(() => {
    Promise.all([
      fetch(`${API}/tasks`).then(r => r.json()),
      fetch(`${API}/users`).then(r => r.json()),
    ]).then(([tasks, users]) => {
      setAllTasks(Array.isArray(tasks) ? tasks : []);
      const members = (Array.isArray(users) ? users : []).map((u, idx) => ({
        id:        u._id || u.email,
        name:      u.name,
        email:     u.email,
        initial:   getInitials(u.name),
        color:     AVATAR_COLORS[idx % AVATAR_COLORS.length],
        joinedDate: u.joinedDate,
      }));
      setRegisteredMembers(members);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
 
  // ── Board columns derived from allTasks
  const boardCols = {
    "col-1": { id: "col-1", title: "To do",       dotClass: "todo",     tasks: allTasks.filter(t => t.column === "col-1" || (!t.column && t.status === "Not Started")) },
    "col-2": { id: "col-2", title: "In Progress",  dotClass: "progress", tasks: allTasks.filter(t => t.column === "col-2" || (!t.column && t.status === "In Progress")) },
    "col-3": { id: "col-3", title: "Done",         dotClass: "done",     tasks: allTasks.filter(t => t.column === "col-3" || (!t.column && t.status === "Done")) },
  };
 
  const filteredTasks = allTasks.filter(task => {
    const matchSearch   = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = filterPriority === "All" || task.priority === filterPriority;
    return matchSearch && matchPriority;
  });
 
  // ── Create task — saved to MongoDB
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const tagsArray = newTaskTags ? newTaskTags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const payload = {
      title:         newTaskTitle,
      description:   newTaskDescription,
      priority:      newTaskPriority,
      priorityColor: PRIORITY_COLORS[newTaskPriority],
      dueDate:       newTaskDueDate,
      tags:          tagsArray,
      status:        "Not Started",
      statusColor:   "#6366f1",
      column:        "col-1",
      assigneesList: [],
      comments:      [],
      created:       new Date().toLocaleString(),
      createdBy:     user?.email,
    };
    try {
      const res  = await fetch(`${API}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const saved = await res.json();
      setAllTasks(prev => [saved, ...prev]);
      setNewTaskTitle(""); setNewTaskDescription(""); setNewTaskPriority("Medium");
      setNewTaskDueDate(""); setNewTaskTags(""); setShowModal(false);
    } catch { alert('Failed to save task. Is the backend running?'); }
  };
 
  // ── Post comment — saved to MongoDB
  const handlePostComment = async () => {
    if (!commentText || !selectedTask) return;
    const newComment = { id: Date.now(), user: user?.name || "User", text: commentText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedTask = { ...selectedTask, comments: [...(selectedTask.comments || []), newComment] };
    try {
      await fetch(`${API}/tasks/${selectedTask._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comments: updatedTask.comments }) });
      setAllTasks(prev => prev.map(t => t._id === selectedTask._id ? updatedTask : t));
      setSelectedTask(updatedTask);
      setCommentText("");
    } catch { setCommentText(""); }
  };
 
  // ── Toggle assignee — saved to MongoDB
  const toggleMemberAssignment = async (member) => {
    if (!selectedTask) return;
    const isAssigned = selectedTask.assigneesList?.some(m => m.id === member.id);
    const updatedList = isAssigned
      ? selectedTask.assigneesList.filter(m => m.id !== member.id)
      : [...(selectedTask.assigneesList || []), member];
    const updatedTask = { ...selectedTask, assigneesList: updatedList };
    try {
      await fetch(`${API}/tasks/${selectedTask._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assigneesList: updatedList }) });
      setAllTasks(prev => prev.map(t => t._id === selectedTask._id ? updatedTask : t));
      setSelectedTask(updatedTask);
    } catch {}
  };
 
  // ── Drag & drop — saved to MongoDB
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const colStatusMap = { "col-1": "Not Started", "col-2": "In Progress", "col-3": "Done" };
    const newStatus      = colStatusMap[destination.droppableId];
    const newStatusColor = STATUS_CONFIG[newStatus]?.color || "#6366f1";
    setAllTasks(prev => prev.map(t =>
      (t._id === draggableId || t.id === draggableId)
        ? { ...t, column: destination.droppableId, status: newStatus, statusColor: newStatusColor }
        : t
    ));
    try {
      await fetch(`${API}/tasks/${draggableId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ column: destination.droppableId, status: newStatus, statusColor: newStatusColor }) });
    } catch {}
  };
 
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: "16px", color: "#888" }}>
      Loading...
    </div>
  );
 
  return (
    <div className="app">
 
      {/* ── Task Detail Panel ── */}
      {selectedTask && (
        <div onClick={() => { setSelectedTask(null); setShowAssignDropdown(false); }}
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "flex-end", zIndex: 2000 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: "600px", background: "#fff", height: "100%", padding: "40px", boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", overflowY: "auto" }}>
 
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
              <FiX size={24} onClick={() => setSelectedTask(null)} style={{ cursor: "pointer", color: "#666" }} />
              <div style={{ display: "flex", gap: "20px", color: "#666" }}>
                <FiClock size={20} /><FiBell size={20} /><FiStar size={20} /><FiMoreHorizontal size={24} />
              </div>
            </div>
 
            <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px" }}>{selectedTask.title}</h1>
 
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "20px", marginBottom: "35px", fontSize: "14px" }}>
              <div style={{ color: "#888", display: "flex", alignItems: "center", gap: "8px" }}><FiClock /> Created time</div>
              <div>{selectedTask.created || new Date(selectedTask.createdAt).toLocaleString()}</div>
 
              <div style={{ color: "#888", display: "flex", alignItems: "center", gap: "8px" }}><FiLayout /> Status</div>
              <div>
                <span style={{ background: STATUS_CONFIG[selectedTask.status]?.bg || "#FFF7ED", color: STATUS_CONFIG[selectedTask.status]?.color || "#F59E0B", padding: "4px 12px", borderRadius: "6px", fontWeight: "600" }}>
                  ● {selectedTask.status}
                </span>
              </div>
 
              <div style={{ color: "#888", display: "flex", alignItems: "center", gap: "8px" }}><FiFilter /> Priority</div>
              <div>
                <span style={{ background: `${selectedTask.priorityColor}20`, color: selectedTask.priorityColor, padding: "4px 12px", borderRadius: "8px", fontWeight: "600" }}>
                  {selectedTask.priority}
                </span>
              </div>
 
              <div style={{ color: "#888", display: "flex", alignItems: "center", gap: "8px" }}><FiCalendar /> Due Date</div>
              <div style={{ background: "#f4f4f5", padding: "6px 12px", borderRadius: "6px", width: "fit-content" }}>
                {selectedTask.dueDate || 'Not set'}
              </div>
 
              <div style={{ color: "#888", display: "flex", alignItems: "center", gap: "8px" }}><FiLayers /> Tags</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {selectedTask.tags?.length > 0
                  ? selectedTask.tags.map(tag => <span key={tag} style={{ background: "#f4f4f5", color: "#666", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>{tag}</span>)
                  : <span style={{ color: "#ccc", fontSize: "13px" }}>No tags</span>}
              </div>
 
              {/* ── Assignees from DB ── */}
              <div style={{ color: "#888", display: "flex", alignItems: "center", gap: "8px" }}><FiUsers /> Assignees</div>
              <div style={{ display: "flex", gap: "4px", alignItems: "center", position: "relative" }}>
                {selectedTask.assigneesList?.map((member, idx) => (
                  <CharacterAvatar key={member.id} member={member} size="28px" fontSize="11px" style={{ marginLeft: idx === 0 ? "0" : "-8px" }} />
                ))}
                <button onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                  style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px dashed #ccc", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "6px", cursor: "pointer", color: "#888" }}>
                  <FiPlus size={14} />
                </button>
                {showAssignDropdown && (
                  <div style={{ position: "absolute", top: "34px", left: 0, background: "#fff", border: "1px solid #eee", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", width: "220px", zIndex: 100, padding: "10px" }}>
                    <p style={{ margin: "0 0 8px 4px", fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Registered Members</p>
                    {registeredMembers.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "#bbb", padding: "8px 4px" }}>No registered users found</p>
                    ) : (
                      registeredMembers.map(member => {
                        const isAssigned = selectedTask.assigneesList?.some(m => m.id === member.id);
                        return (
                          <div key={member.id} onClick={() => toggleMemberAssignment(member)}
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", cursor: "pointer", borderRadius: "8px", background: isAssigned ? "#f0f0ff" : "transparent", marginBottom: "2px" }}>
                            <CharacterAvatar member={member} size="32px" fontSize="12px" />
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: "13px", fontWeight: "600" }}>{member.name}</p>
                              <p style={{ margin: 0, fontSize: "11px", color: "#999" }}>{member.email}</p>
                            </div>
                            {isAssigned && <FiCheckSquare size={16} color="#6366f1" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
 
            <div style={{ background: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Project Description</h4>
              <p style={{ color: "#666", lineHeight: "1.6", fontSize: "14px" }}>{selectedTask.description || 'No description.'}</p>
            </div>
 
            {/* Tabs */}
            <div style={{ borderBottom: "1px solid #eee", display: "flex", gap: "25px", paddingBottom: "10px", marginBottom: "25px", fontSize: "14px" }}>
              {["Activity", "My Work", "Assigned", "Comments"].map(tab => (
                <span key={tab} onClick={() => setActiveDetailTab(tab)}
                  style={{ cursor: "pointer", color: activeDetailTab === tab ? "#6366F1" : "#888", fontWeight: activeDetailTab === tab ? "600" : "400", borderBottom: activeDetailTab === tab ? "2px solid #6366F1" : "none", paddingBottom: "10px" }}>
                  {tab} {tab === "Comments" && `(${selectedTask.comments?.length || 0})`}
                </span>
              ))}
            </div>
 
            {/* Tab Content */}
            <div style={{ fontSize: "14px" }}>
              {activeDetailTab === "Activity" && (
                <div>
                  <p style={{ fontWeight: "600", marginBottom: "15px" }}>Today</p>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                    <CharacterAvatar member={loggedInMember} size="32px" fontSize="12px" />
                    <div>
                      <p><strong>{user?.name}</strong> created task <strong>"{selectedTask.title}"</strong></p>
                      <small style={{ color: "#aaa" }}>{selectedTask.created || new Date(selectedTask.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                 
                </div>
              )}
 
              {activeDetailTab === "Assigned" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedTask.assigneesList?.length > 0 ? selectedTask.assigneesList.map(member => (
                    <div key={member.id} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "16px", background: "#F9FAFB", borderRadius: "16px" }}>
                      <CharacterAvatar member={member} size="44px" fontSize="16px" />
                      <div>
                        <div style={{ fontWeight: "600", color: "#111", fontSize: "15px" }}>{member.name}</div>
                        <div style={{ fontSize: "12px", color: "#888" }}>{member.email}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", color: "#bbb", marginTop: "40px" }}>
                      <FiUsers size={32} style={{ marginBottom: "10px" }} />
                      <p>No members assigned yet.</p>
                      <p style={{ fontSize: "13px" }}>Click the + button above to assign members.</p>
                    </div>
                  )}
                </div>
              )}
 
              {activeDetailTab === "Comments" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    {selectedTask.comments?.map((c, i) => (
                      <div key={c.id || i} style={{ display: "flex", gap: "12px", marginBottom: "15px" }}>
                        <CharacterAvatar member={{ initial: c.user?.charAt(0).toUpperCase(), color: '#6366f1' }} size="32px" fontSize="12px" />
                        <div style={{ background: "#f8f9fa", padding: "10px 15px", borderRadius: "12px", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontWeight: "600" }}>{c.user}</span>
                            <small style={{ color: "#aaa" }}>{c.time}</small>
                          </div>
                          <p style={{ margin: 0, color: "#444" }}>{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <CharacterAvatar member={loggedInMember} size="32px" fontSize="12px" />
                    <div style={{ flex: 1 }}>
                      <textarea placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)}
                        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #eee", minHeight: "80px", outline: "none", resize: "none", fontSize: "14px" }} />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                        <button onClick={handlePostComment} style={{ background: "#6366F1", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
 
      {/* ── Create Task Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "460px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Create New Task</h3>
              <FiX onClick={() => setShowModal(false)} style={{ cursor: "pointer", color: "#888" }} size={20} />
            </div>
            <form onSubmit={handleAddTask}>
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Task Title *</label>
              <input autoFocus type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Enter task name..."
                style={{ width: "100%", padding: "10px 14px", margin: "8px 0 16px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", fontSize: "14px", boxSizing: "border-box" }} />
 
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Due Date</label>
              <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", margin: "8px 0 16px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", fontSize: "14px", boxSizing: "border-box" }} />
 
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Tags (comma separated)</label>
              <input type="text" value={newTaskTags} onChange={(e) => setNewTaskTags(e.target.value)} placeholder="e.g. Design, Frontend, Bug"
                style={{ width: "100%", padding: "10px 14px", margin: "8px 0 16px", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", fontSize: "14px", boxSizing: "border-box" }} />
 
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Description</label>
              <textarea value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} placeholder="Enter details..."
                style={{ width: "100%", padding: "10px 14px", margin: "8px 0 16px", borderRadius: "10px", border: "1.5px solid #e0e0e0", minHeight: "80px", resize: "none", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
 
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Priority</label>
              <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", margin: "8px 0 24px", borderRadius: "10px", border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none" }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button type="submit" className="invite-btn" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>Create Task</button>
            </form>
          </div>
        </div>
      )}
 
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="profile-card">
          <div className="profile-left">
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: userColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", flexShrink: 0 }}>
              {userInitial}
            </div>
            <div className="profile-info">
              <h4>{user?.name || 'User'}</h4>
              <small style={{ maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{user?.email || ''}</small>
            </div>
          </div>
          <FiMoreVertical className="profile-menu" />
        </div>
 
        <div className="menu-section">
          <h5>Menu</h5>
          <p className={activeMenu === "Dashboard" ? "active" : ""} onClick={() => setActiveMenu("Dashboard")}><FiHome /> Dashboard</p>
          <p className={activeMenu === "Inbox"     ? "active" : ""} onClick={() => setActiveMenu("Inbox")}><FiInbox /> Inbox</p>
          <p className={activeMenu === "Calendar"  ? "active" : ""} onClick={() => setActiveMenu("Calendar")}><FiCalendar /> Calendar</p>
        </div>
 
        <div className="menu-section">
          <h5>Team spaces <FiPlus /></h5>
          <p className={activeMenu === "Tasks"   ? "active" : ""} onClick={() => { setActiveMenu("Tasks"); setActiveTab("Board"); }}><FiGrid /> Tasks</p>
          <p className={activeMenu === "Docs"    ? "active" : ""} onClick={() => setActiveMenu("Docs")}><FiList /> Docs</p>
          <p className={activeMenu === "Meeting" ? "active" : ""} onClick={() => setActiveMenu("Meeting")}><FiClock /> Meeting</p>
        </div>
 
        <div className="menu-section other-nav">
          <h5>Other</h5>
          <p className={activeMenu === "Settings" ? "active" : ""} onClick={() => setActiveMenu("Settings")}><FiSettings /> Profile</p>
          <p className={activeMenu === "Support"  ? "active" : ""} onClick={() => setActiveMenu("Support")}><FiHelpCircle /> Support</p>
          <p onClick={onLogout} style={{ color: '#ef4444' }}><FiLogOut /> Logout</p>
        </div>
      </aside>
 
      {/* ── Main Content ── */}
      <main className="main">
        <header className="top-row">
          <div className="breadcrumb">
            <FiChevronLeft size={18} />
            <span>Team spaces <FiChevronRight size={12} /> {activeMenu}</span>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <span className="search-cmd">⌘ F</span>
            </div>
            <button className="icon-action-btn"><FiHelpCircle size={18} /></button>
            <button className="icon-action-btn"><FiBell size={18} /><span className="notification-dot"></span></button>
          </div>
        </header>
 
        {/* Profile Page */}
        {activeMenu === "Settings" ? (
          <ProfilePage user={user} onLogout={onLogout} />
        ) : (
          <>
            <section className="header-top">
              <div>
                <h2>{activeMenu}</h2>
                <p className="subtitle">Short description for {activeMenu} goes here</p>
              </div>
              <div className="right-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {registeredMembers.slice(0, 3).map((m, i) => (
                    <CharacterAvatar key={m.id} member={m} size="30px" style={{ marginLeft: i === 0 ? 0 : "-10px" }} />
                  ))}
                  {registeredMembers.length > 3 && <span className="avatar-more">+{registeredMembers.length - 3}</span>}
                </div>
                <button className="invite-btn"><FiUserPlus size={16} /> Invite Member</button>
                <button className="share-btn"><FiShare2 size={16} /> Share</button>
              </div>
            </section>
 
            <nav className="tabs-row">
              <div className="tabs">
                {[["Overview", <FiLayout size={14}/>], ["Board", <FiGrid size={14}/>], ["List", <FiList size={14}/>], ["Table", <FiLayers size={14}/>], ["Timeline", <FiClock size={14}/>]].map(([name, icon]) => (
                  <span key={name} className={activeTab === name ? "active-tab" : ""} onClick={() => setActiveTab(name)}>{icon} {name}</span>
                ))}
              </div>
              <div className="filters">
                <div style={{ position: "relative" }}>
                  <span onClick={() => setShowFilterDropdown(!showFilterDropdown)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiFilter color={filterPriority !== "All" ? "#6366f1" : "inherit"} /> Filter {filterPriority !== "All" && `: ${filterPriority}`}
                  </span>
                  {showFilterDropdown && (
                    <div style={{ position: "absolute", top: "30px", left: 0, background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "8px", zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: "120px" }}>
                      {["All", "High", "Medium", "Low"].map(p => (
                        <div key={p} onClick={() => { setFilterPriority(p); setShowFilterDropdown(false); }}
                          style={{ padding: "6px 12px", cursor: "pointer", fontSize: "13px", background: filterPriority === p ? "#f0f0ff" : "transparent", color: filterPriority === p ? "#6366f1" : "#444", borderRadius: "4px" }}>
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}><FiGrid /> Group by</span>
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}><FiList /> Sort</span>
                
              </div>
            </nav>
 
            {activeTab === "Overview" && activeMenu === "Tasks" ? (
              <OverviewPage tasks={allTasks} />
            ) : activeTab === "List" ? (
              <ListView tasks={filteredTasks} onTaskClick={(t) => { setSelectedTask(t); setActiveDetailTab("Activity"); }} />
            ) : activeTab === "Table" ? (
              <TableView tasks={filteredTasks} onTaskClick={(t) => { setSelectedTask(t); setActiveDetailTab("Activity"); }} />
            ) : activeTab === "Board" && activeMenu === "Tasks" ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="board-view">
                  {Object.values(boardCols).map(col => {
                    const colTasks = col.tasks.filter(task => {
                      const matchSearch   = task.title.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchPriority = filterPriority === "All" || task.priority === filterPriority;
                      return matchSearch && matchPriority;
                    });
                    return (
                      <div className="column" key={col.id}>
                        <div className="column-header">
                          <span className="col-title"><span className={`dot ${col.dotClass}`}></span> {col.title} <span className="count">{colTasks.length}</span></span>
                          <div className="col-actions"><FiPlus onClick={() => setShowModal(true)} /><FiMoreHorizontal /></div>
                        </div>
                        <Droppable droppableId={col.id}>
                          {(provided) => (
                            <div className="task-list" {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: "200px" }}>
                              {colTasks.map((task, index) => (
                                <Draggable key={task._id || task.id} draggableId={task._id || task.id} index={index}>
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, marginBottom: "12px" }}>
                                      <TaskCard task={task} onClick={() => { setSelectedTask(task); setActiveDetailTab("Activity"); }} />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                  <div className="add-column-placeholder" onClick={() => setShowModal(true)}><FiPlus /></div>
                </div>
              </DragDropContext>
            ) : (
              <div className="empty-state">
                <h3>{activeMenu} — {activeTab} View</h3>
                <p>Coming soon</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
 
export default DashboardApp;