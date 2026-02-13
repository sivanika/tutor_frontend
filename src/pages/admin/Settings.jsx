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
      localStorage.setItem("user", JSON.stringify(res.data.user))
    } catch (err) {
      setMessage("Failed to update profile")
    }
  }

  return (
    <div className="max-w-md space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Settings
      </h2>

      {/* Profile Card */}
      <form
        onSubmit={handleSubmit}
        className="
          p-6 rounded-2xl space-y-4

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-xl

          border border-slate-200 dark:border-slate-800
          shadow-md dark:shadow-black/30
        "
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Admin Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="
              w-full p-3 rounded-lg
              bg-slate-50 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-slate-500
              transition
            "
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Admin Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="
              w-full p-3 rounded-lg
              bg-slate-50 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-slate-500
              transition
            "
            required
          />
        </div>

        <button
          type="submit"
          className="
            w-full py-3 rounded-lg font-semibold

            bg-slate-900 text-white
            hover:bg-black

            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white

            transition-all duration-200
            active:scale-95
          "
        >
          Update Profile
        </button>

        {message && (
          <p className="text-sm mt-2 text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </form>

      {/* Future Settings */}
      <div
        className="
          p-6 rounded-2xl

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-xl

          border border-slate-200 dark:border-slate-800
          shadow-md dark:shadow-black/30
        "
      >
        <h3 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">
          Future Configurations
        </h3>

        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-sm space-y-1">
          <li>Change password</li>
          <li>System maintenance mode</li>
          <li>Email notification settings</li>
          <li>Theme preferences</li>
        </ul>
      </div>
    </div>
  )
}