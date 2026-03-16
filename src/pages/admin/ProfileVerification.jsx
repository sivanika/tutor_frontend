import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiShield, FiSearch, FiCheck, FiX, FiStar, FiLoader,
  FiUsers, FiClock, FiCheckCircle
} from "react-icons/fi";

export default function ProfileVerification() {
  const [pending, setPending] = useState([]);
  const [verified, setVerified] = useState([]);
  const [search, setSearch] = useState("");
  // featuredEdits: { [id]: { isFeatured, featuredOrder } }
  const [featuredEdits, setFeaturedEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  const loadData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        API.get("/admin/pending-professors"),
        API.get("/admin/featured-professors"),
      ]);
      setPending(r1.data || []);
      const verifiedList = r2.data || [];
      setVerified(verifiedList);
      const edits = {};
      verifiedList.forEach((p) => {
        edits[p._id] = {
          isFeatured: p.isFeatured ?? false,
          featuredOrder: p.featuredOrder ?? 0,
        };
      });
      setFeaturedEdits(edits);
    } catch {
      toast.error("Failed to load professors");
    }
  };

  useEffect(() => { loadData(); }, []);

  const filterList = (list) =>
    list.filter((p) => {
      const name = (p?.name || "").toLowerCase();
      const email = (p?.email || "").toLowerCase();
      return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    });

  const approveProfessor = async (id) => {
    try {
      await API.put(`/admin/approve-professor/${id}`);
      toast.success("Professor approved ✓");
      loadData();
    } catch { toast.error("Approval failed"); }
  };

  const rejectProfessor = async (id) => {
    try {
      await API.put(`/admin/reject-professor/${id}`);
      toast.success("Professor rejected");
      loadData();
    } catch { toast.error("Rejection failed"); }
  };

  const saveFeatured = async (id) => {
    setSavingId(id);
    try {
      const edit = featuredEdits[id] || {};
      await API.put(`/admin/feature-professor/${id}`, {
        isFeatured: !!edit.isFeatured,
        featuredOrder: Number(edit.featuredOrder) || 0,
      });
      toast.success(edit.isFeatured ? "Marked as Featured ⭐" : "Removed from Featured");
      loadData();
    } catch {
      toast.error("Failed to save featured status");
    } finally { setSavingId(null); }
  };

  const updateEdit = (id, key, value) => {
    setFeaturedEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const featuredProfs = filterList(verified).filter((p) => p.isFeatured);
  const nonFeaturedProfs = filterList(verified).filter((p) => !p.isFeatured);

  const STAT_ITEMS = [
    { label: "Pending", value: pending.length, icon: FiClock, bg: "bg-amber-50", color: "text-amber-500", grad: "from-amber-400 to-yellow-500" },
    { label: "Verified", value: verified.length, icon: FiCheckCircle, bg: "bg-emerald-50", color: "text-emerald-500", grad: "from-emerald-400 to-teal-500" },
    { label: "Featured", value: featuredProfs.length, icon: FiStar, bg: "bg-purple-50", color: "text-[#6A11CB]", grad: "from-[#6A11CB] to-[#2575FC]" },
    { label: "Total", value: pending.length + verified.length, icon: FiUsers, bg: "bg-blue-50", color: "text-[#2575FC]", grad: "from-[#2575FC] to-[#FF4E9B]" },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Professor Verification</h2>
          <p className="text-sm text-gray-400 mt-0.5">Approve applicants and manage featured tutors on the home page</p>
        </div>
        {/* Search */}
        <div className="relative min-w-[240px]">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/30 focus:border-[#6A11CB] focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_ITEMS.map(({ label, value, icon: Icon, bg, color, grad }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`${bg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-0.5">{value}</div>
            <div className="text-xs text-gray-400">{label} professors</div>
            <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${grad}`} />
          </div>
        ))}
      </div>

      {/* ═══════════ ⭐ FEATURED TUTORS ═══════════ */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-amber-50/50">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <FiStar size={15} className="text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Featured on Home Page</h3>
            <p className="text-xs text-gray-400">Lower order number = appears first in the carousel</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#6A11CB] to-[#2575FC]">
            {featuredProfs.length} / 6
          </span>
        </div>

        <div className="p-4">
          {featuredProfs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-1">
                <FiStar size={22} className="text-amber-300" />
              </div>
              <p className="font-medium text-sm">No featured tutors yet</p>
              <p className="text-xs text-center max-w-xs">Toggle ⭐ on a verified professor below to feature them on the homepage.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {featuredProfs
                .sort((a, b) => (featuredEdits[a._id]?.featuredOrder ?? 0) - (featuredEdits[b._id]?.featuredOrder ?? 0))
                .map((prof, idx) => (
                  <FeaturedRow
                    key={prof._id}
                    prof={prof}
                    idx={idx}
                    edit={featuredEdits[prof._id] || {}}
                    saving={savingId === prof._id}
                    onToggle={(v) => updateEdit(prof._id, "isFeatured", v)}
                    onOrderChange={(v) => updateEdit(prof._id, "featuredOrder", v)}
                    onSave={() => saveFeatured(prof._id)}
                    isFeaturedSection
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ PENDING ═══════════ */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-amber-50/30">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <FiClock size={15} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Pending Verification</h3>
            <p className="text-xs text-gray-400">{filterList(pending).length} awaiting review</p>
          </div>
        </div>

        <div className="p-4">
          {filterList(pending).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
              <FiCheckCircle size={24} className="text-emerald-300" />
              <p className="text-sm">No pending professors — all clear!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filterList(pending).map((prof) => {
                const initials = prof.name
                  ? prof.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                  : prof.email?.[0]?.toUpperCase() || "P"
                return (
                  <div
                    key={prof._id}
                    className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-amber-50/40 border border-amber-100 hover:bg-amber-50 transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{prof.name || "No name"}</p>
                      <p className="text-xs text-gray-500 truncate">{prof.email}</p>
                      {prof.subjects && (
                        <p className="text-xs text-[#6A11CB] mt-0.5 truncate">{prof.subjects}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => approveProfessor(prof._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <FiCheck size={14} /> Approve
                      </button>
                      <button
                        onClick={() => rejectProfessor(prof._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
                      >
                        <FiX size={14} /> Reject
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ VERIFIED — NOT FEATURED ═══════════ */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-emerald-50/30">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <FiShield size={15} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Verified — Not Featured</h3>
            <p className="text-xs text-gray-400">{nonFeaturedProfs.length} verified professors not on home page</p>
          </div>
        </div>

        <div className="p-4">
          {nonFeaturedProfs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
              <FiStar size={22} className="text-[#6A11CB]/40" />
              <p className="text-sm">All verified professors are featured!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {nonFeaturedProfs.map((prof, idx) => (
                <FeaturedRow
                  key={prof._id}
                  prof={prof}
                  idx={idx}
                  edit={featuredEdits[prof._id] || {}}
                  saving={savingId === prof._id}
                  onToggle={(v) => updateEdit(prof._id, "isFeatured", v)}
                  onOrderChange={(v) => updateEdit(prof._id, "featuredOrder", v)}
                  onSave={() => saveFeatured(prof._id)}
                  isFeaturedSection={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ────────────────── FeaturedRow ────────────────── */
function FeaturedRow({ prof, edit, saving, onToggle, onOrderChange, onSave, isFeaturedSection }) {
  const hasChanges =
    edit.isFeatured !== prof.isFeatured ||
    Number(edit.featuredOrder) !== Number(prof.featuredOrder ?? 0);

  const initials = prof.name
    ? prof.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : prof.email?.[0]?.toUpperCase() || "P"

  return (
    <div className={`flex flex-wrap items-center gap-3 p-3.5 rounded-xl border transition-all ${
      isFeaturedSection
        ? "bg-amber-50/60 border-amber-200/70 hover:bg-amber-50"
        : "bg-gray-50/60 border-gray-200/70 hover:bg-gray-50/80"
    }`}>

      {/* Star toggle */}
      <button
        onClick={() => onToggle(!edit.isFeatured)}
        title={edit.isFeatured ? "Remove from featured" : "Mark as featured"}
        className={`text-xl transition-all hover:scale-125 ${
          edit.isFeatured ? "text-amber-400 drop-shadow-sm" : "text-gray-300 hover:text-amber-300"
        }`}
      >
        ⭐
      </button>

      {/* Avatar + Info */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 ${
          isFeaturedSection
            ? "bg-gradient-to-br from-amber-400 to-orange-400"
            : "bg-gradient-to-br from-[#6A11CB] to-[#2575FC]"
        }`}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">{prof.name || "No name"}</p>
          <p className="text-xs text-gray-400 truncate">{prof.email}</p>
          {prof.subjects && (
            <p className="text-xs text-[#6A11CB] mt-0.5 truncate">{prof.subjects}</p>
          )}
        </div>
      </div>

      {/* Priority order */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-gray-400 whitespace-nowrap">Order</span>
        <input
          type="number"
          min={0}
          max={99}
          value={edit.featuredOrder ?? 0}
          onChange={(e) => onOrderChange(e.target.value)}
          className="w-14 px-2 py-1.5 rounded-lg text-sm text-center border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/30 focus:border-[#6A11CB] transition"
        />
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={saving || !hasChanges}
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
          hasChanges && !saving
            ? "bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white hover:shadow-md hover:-translate-y-0.5"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {saving ? <><FiLoader size={12} className="animate-spin" /> Saving</> : "Save"}
      </button>
    </div>
  );
}