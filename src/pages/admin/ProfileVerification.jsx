import { useEffect, useState } from "react"
import API from "../../services/api"
import toast from "react-hot-toast"

export default function ProfileVerification() {
  const [pending, setPending] = useState([])
  const [verified, setVerified] = useState([])
  const [search, setSearch] = useState("")
  const [selectedProfessor, setSelectedProfessor] = useState(null)

  const loadData = async () => {
    try {
      const res1 = await API.get("/admin/pending-professors")
      const res2 = await API.get("/admin/verified-professors")
      setPending(res1.data)
      setVerified(res2.data)
    } catch {
      toast.error("Failed to load professors")
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const verifyProfessor = async (id) => {
    if (!window.confirm("Are you sure you want to verify this professor?")) return

    try {
      await API.put(`/admin/verify/${id}`)
      toast.success("Professor verified successfully!")
      loadData()
    } catch {
      toast.error("Verification failed")
    }
  }

  const filterList = (list) =>
    list.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    )

  const filteredPending = filterList(pending)
  const filteredVerified = filterList(verified)
  const viewProfessor = async (id) => {
    try {
      const res = await API.get(`/admin/professor/${id}`)
      setSelectedProfessor(res.data)
    } catch {
      toast.error("Failed to load professor details")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Verification</h2>

      <input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 border rounded"
      />

      {/* Pending */}
      <h3 className="text-lg font-semibold mb-2 text-red-600">Pending Professors</h3>
        {filteredPending.map((p) => (
          <div key={p._id} className="flex gap-2">
            <button
              onClick={() => viewProfessor(p._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              View
            </button>
  
            <button
              onClick={() => verifyProfessor(p._id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          </div>
        ))}
  
        {/* Verified */}
        <h3 className="text-lg font-semibold mt-8 mb-2 text-green-600">Verified Professors</h3>
        {filteredVerified.map((p) => (
          <div key={p._id} className="bg-green-100 p-3 mb-2 rounded shadow">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-600">{p.email}</p>
          </div>
        ))}
  
        {selectedProfessor && (
          <ProfessorDetailsModal
            professor={selectedProfessor}
            onClose={() => setSelectedProfessor(null)}
          />
        )}
      </div>
    )
  }
