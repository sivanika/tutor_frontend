import { useState, useEffect } from "react"
import API from "../../services/api"
import toast from "react-hot-toast"
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi"

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    description: "",
    price: 0,
    period: "monthly",
    maxSessions: "",
    maxProfileViews: "",
    isActive: true
  })

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await API.get("/subscriptions/admin/plans")
      setPlans(res.data)
    } catch (err) {
      toast.error("Failed to fetch plans")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setFormData({
        ...plan,
        maxSessions: plan.maxSessions === null ? "" : plan.maxSessions,
        maxProfileViews: plan.maxProfileViews === null ? "" : plan.maxProfileViews,
      })
    } else {
      setFormData({
        _id: null, name: "", description: "", price: 0, period: "monthly",
        maxSessions: "", maxProfileViews: "", isActive: true
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        maxSessions: formData.maxSessions === "" ? null : parseInt(formData.maxSessions),
        maxProfileViews: formData.maxProfileViews === "" ? null : parseInt(formData.maxProfileViews),
      }

      if (formData._id) {
        await API.put(`/subscriptions/admin/plans/${formData._id}`, payload)
        toast.success("Plan updated successfully")
      } else {
        await API.post("/subscriptions/admin/plans", payload)
        toast.success("Plan created successfully")
      }
      setShowModal(false)
      fetchPlans()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save plan")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan? This may break existing subscriptions.")) return
    try {
      await API.delete(`/subscriptions/admin/plans/${id}`)
      toast.success("Plan deleted")
      fetchPlans()
    } catch (err) {
      toast.error("Failed to delete plan")
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subscription Plans</h2>
          <p className="text-sm text-gray-500 mt-1">Manage pricing tiers and limits</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#6A11CB] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#5a0bb0] transition"
        >
          <FiPlus /> Create Plan
        </button>
      </div>

      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan._id} className={`bg-white rounded-2xl p-6 border-2 transition-all ${plan.isActive ? 'border-gray-100 hover:border-[#6A11CB]' : 'border-gray-200 opacity-60'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                <span className="text-2xl font-black text-[#6A11CB]">
                  {plan.price === 0 ? "Free" : `₹${plan.price / 100}`}
                  <span className="text-sm font-normal text-gray-500">/{plan.period === "monthly" ? "mo" : plan.period}</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6 h-10">{plan.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Session Limit:</span>
                  <span className="font-semibold text-gray-800">{plan.maxSessions === null ? "Unlimited" : plan.maxSessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile Views:</span>
                  <span className="font-semibold text-gray-800">{plan.maxProfileViews === null ? "Unlimited" : plan.maxProfileViews}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold flex items-center gap-1 ${plan.isActive ? 'text-green-600' : 'text-red-500'}`}>
                    {plan.isActive ? <FiCheckCircle /> : <FiXCircle />} {plan.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => handleOpenModal(plan)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(plan._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-springUp">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{formData._id ? "Edit Plan" : "Create Plan"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Plan Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A11CB] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (paise, e.g., 9900 = ₹99)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A11CB] outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A11CB] outline-none" placeholder="Short description for users" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Sessions (Leave empty for unlimited)</label>
                  <input type="number" placeholder="Unlimited" value={formData.maxSessions} onChange={e => setFormData({...formData, maxSessions: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A11CB] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Profile Views</label>
                  <input type="number" placeholder="Unlimited" value={formData.maxProfileViews} onChange={e => setFormData({...formData, maxProfileViews: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A11CB] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Period (e.g., 'monthly', '7 days')</label>
                  <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A11CB] outline-none" />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-[#6A11CB]" />
                    <span className="text-sm font-semibold text-gray-700">Plan is Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#6A11CB] text-white font-semibold rounded-xl hover:bg-[#5a0bb0] shadow-md transition">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
