import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

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
        API.get("/admin/featured-professors"), // returns all verified, sorted by order
      ]);
      setPending(r1.data || []);
      const verifiedList = r2.data || [];
      setVerified(verifiedList);
      // Seed local edit state from DB values
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

  // Separate featured vs non-featured among verified
  const featuredProfs = filterList(verified).filter((p) => p.isFeatured);
  const nonFeaturedProfs = filterList(verified).filter((p) => !p.isFeatured);

  return (
    <div className="p-6 space-y-10">

      {/* ── Title ── */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Professor Verification
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Approve, reject, and manage featured tutors on the home page.
        </p>
      </div>

      {/* ── Search ── */}
      <input
        type="text"
        placeholder="Search by name or email…"
        className="w-full max-w-md p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40 transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ═══════════════════════════════════════════
          ⭐ FEATURED TUTORS (home page carousel)
      ═══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⭐</span>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Featured on Home Page
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              These tutors appear in the "Recommended Tutors" carousel. Lower order number = appears first.
            </p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#6A11CB,#2575FC)" }}>
            {featuredProfs.length} / 6
          </span>
        </div>

        {featuredProfs.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-[#6A11CB]/30 dark:border-[#6A11CB]/20 p-8 text-center text-slate-500 dark:text-slate-400">
            <p className="text-4xl mb-2">🎓</p>
            <p className="font-semibold">No featured tutors yet</p>
            <p className="text-sm mt-1">Toggle ⭐ on any verified professor below to feature them.</p>
          </div>
        )}

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
      </section>

      {/* ═══════════════════════════════
          PENDING PROFESSORS
      ═══════════════════════════════ */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
          ⏳ Pending Verification ({filterList(pending).length})
        </h2>

        {filterList(pending).length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">No pending professors.</p>
        )}

        <div className="space-y-3">
          {filterList(pending).map((prof) => (
            <div
              key={prof._id}
              className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{prof.name || "No name"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{prof.email}</p>
                {prof.subjects && <p className="text-xs text-[#6A11CB] mt-0.5">{prof.subjects}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approveProfessor(prof._id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-black dark:bg-slate-100 dark:text-black dark:hover:bg-white transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectProfessor(prof._id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════
          VERIFIED — NOT FEATURED
      ═══════════════════════════════ */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
          ✅ Verified Professors — Not Featured ({nonFeaturedProfs.length})
        </h2>

        {nonFeaturedProfs.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">All verified professors are featured!</p>
        )}

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
      </section>

    </div>
  );
}

/* ────────────────── FeaturedRow sub-component ────────────────── */
function FeaturedRow({ prof, edit, saving, onToggle, onOrderChange, onSave, isFeaturedSection }) {
  const hasChanges =
    edit.isFeatured !== prof.isFeatured ||
    Number(edit.featuredOrder) !== Number(prof.featuredOrder ?? 0);

  return (
    <div
      className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border transition-all ${isFeaturedSection
          ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/30"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        }`}
    >
      {/* Star toggle */}
      <button
        onClick={() => onToggle(!edit.isFeatured)}
        title={edit.isFeatured ? "Remove from featured" : "Mark as featured"}
        className={`text-2xl transition-transform hover:scale-125 ${edit.isFeatured ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
      >
        ⭐
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{prof.name || "No name"}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{prof.email}</p>
        {prof.subjects && <p className="text-xs text-[#6A11CB] dark:text-[#a78bfa] mt-0.5 truncate">{prof.subjects}</p>}
      </div>

      {/* Priority order */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Order #
        </label>
        <input
          type="number"
          min={0}
          max={99}
          value={edit.featuredOrder ?? 0}
          onChange={(e) => onOrderChange(e.target.value)}
          className="w-16 px-2 py-1.5 rounded-lg text-sm text-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40"
        />
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={saving || !hasChanges}
        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all ${hasChanges && !saving
            ? "bg-gradient-to-r from-[#6A11CB] to-[#2575FC] hover:scale-105 hover:shadow-md"
            : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60"
          }`}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}