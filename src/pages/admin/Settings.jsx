import { useState, useEffect } from "react"
import API from "../../services/api"

export default function Settings() {
  const storedUser = JSON.parse(localStorage.getItem("user"))

  const [form, setForm] = useState({
    name: "",
    email: "",
  })
  
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (storedUser) {
      setForm({
        name: storedUser.name,
        email: storedUser.email,
      })
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.put("/admin/update-profile", form)

      setMessage("Profile updated successfully")

      // update localStorage user info
      localStorage.setItem("user", JSON.stringify(res.data.user))
    } catch (err) {
      setMessage("Failed to update profile")
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">
            Admin Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Admin Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          Update Profile
        </button>

        {message && (
          <p className="text-sm mt-2 text-green-600">
            {message}
          </p>
        )}
      </form>

      {/* Future Settings Section */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-2">
          Future Configurations
        </h3>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          <li>Change password</li>
          <li>System maintenance mode</li>
          <li>Email notification settings</li>
          <li>Theme preferences</li>
        </ul>
      </div>
    </div>
  )
}
