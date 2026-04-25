import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiBookOpen, FiLink, FiCalendar, FiClock, FiLayers,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiPlusCircle,
} from "react-icons/fi";

const EMPTY = { title: "", level: "", date: "", time: "", meetLink: "" };
const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function CreateSessionTab() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [lastSession, setLastSession] = useState(null);       // holds last created session
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // ── CREATE ──────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/sessions", form);
      setLastSession(res.data);
      setForm(EMPTY);
      setRescheduleMode(false);
      toast.success("Session created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create session");
    } finally {
      setSubmitting(false);
    }
  };

  // ── CONTINUE (create another) ────────────────────────────
  const handleContinue = () => {
    setLastSession(null);
    setRescheduleMode(false);
  };

  // ── CANCEL ──────────────────────────────────────────────
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this session?")) return;
    setActionLoading(true);
    try {
      await API.patch(`/sessions/${lastSession._id}/cancel`);
      setLastSession(prev => ({ ...prev, status: "cancelled" }));
      toast.success("Session cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ── RESCHEDULE ──────────────────────────────────────────
  const handleReschedule = async e => {
    e.preventDefault();
    if (!newDate && !newTime) {
      toast.error("Enter a new date or time");
      return;
    }
    setActionLoading(true);
    try {
      const res = await API.patch(`/sessions/${lastSession._id}/reschedule`, {
        date: newDate || undefined,
        time: newTime || undefined,
      });
      setLastSession(res.data.session);
      setRescheduleMode(false);
      setNewDate("");
      setNewTime("");
      toast.success("Session rescheduled!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reschedule failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ── STATUS BADGE ─────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const map = {
      active: "bg-green-50 text-green-600",
      cancelled: "bg-red-50 text-red-500",
      completed: "bg-blue-50 text-blue-600",
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || "bg-gray-100 text-gray-500"}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Create New Session</h2>
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details to schedule a tutoring session for your students.</p>
      </div>

      {/* ── Post-creation action panel ──────────────────── */}
      {lastSession && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <FiCheckCircle size={18} />
              <span className="font-semibold text-sm">Session Created</span>
            </div>
            <StatusBadge status={lastSession.status} />
          </div>

          {/* Info */}
          <div className="px-6 py-4 space-y-1 border-b border-gray-100">
            <p className="font-semibold text-gray-800">{lastSession.title}</p>
            <p className="text-xs text-gray-400">
              {lastSession.date} &nbsp;·&nbsp; {lastSession.time} &nbsp;·&nbsp; Level: {lastSession.level}
            </p>
          </div>

          {/* Reschedule form (inline) */}
          {rescheduleMode && lastSession.status !== "cancelled" && (
            <form onSubmit={handleReschedule} className="px-6 py-4 space-y-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">Pick a new schedule</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <FiClock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] hover:opacity-90 disabled:opacity-60 transition"
                >
                  {actionLoading ? "Saving…" : "Confirm Reschedule"}
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleMode(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Action buttons */}
          <div className="px-6 py-4 flex flex-wrap gap-3">
            {/* Continue */}
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] hover:opacity-90 transition"
            >
              <FiPlusCircle size={15} />
              Continue (Create Another)
            </button>

            {/* Reschedule */}
            {lastSession.status !== "cancelled" && (
              <button
                onClick={() => setRescheduleMode(r => !r)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  text-[var(--primary)] border border-[var(--primary)]/40 hover:bg-blue-50 disabled:opacity-60 transition"
              >
                <FiRefreshCw size={15} />
                Reschedule
              </button>
            )}

            {/* Cancel Session */}
            {lastSession.status !== "cancelled" && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  text-red-500 border border-red-200 hover:bg-red-50 disabled:opacity-60 transition"
              >
                <FiXCircle size={15} />
                {actionLoading ? "Cancelling…" : "Cancel Session"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Create session form ─────────────────────────── */}
      {!lastSession && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] px-6 py-5">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FiBookOpen size={18} className="text-white/80" />
              Session Details
            </h3>
            <p className="text-white/50 text-xs mt-0.5">All fields are required</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Session Title
              </label>
              <div className="relative">
                <FiBookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="title"
                  placeholder="e.g. Advanced Calculus — Week 3"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Level
              </label>
              <div className="relative">
                <FiLayers size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50 focus:bg-white transition appearance-none"
                >
                  <option value="">Select a level…</option>
                  {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Date</label>
                <div className="relative">
                  <FiCalendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Time</label>
                <div className="relative">
                  <FiClock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Meeting Link
              </label>
              <div className="relative">
                <FiLink size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="meetLink"
                  type="url"
                  placeholder="https://meet.google.com/…"
                  value={form.meetLink}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm
                bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]
                hover:from-[#5A0EAD] hover:to-[#1D63D8]
                shadow-md hover:shadow-lg hover:-translate-y-0.5
                transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating…
                </span>
              ) : (
                "Create Session"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
