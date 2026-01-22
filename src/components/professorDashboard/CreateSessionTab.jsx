import { useState } from "react";
import API from "../../services/api";

export default function CreateSessionTab() {
  const [form, setForm] = useState({
    title: "",
    level: "",
    date: "",
    time: "",
    meetLink: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/sessions", form);
      alert("Session created successfully");
      console.log("SESSION CREATED:", res.data);

      // clear form
      setForm({
        title: "",
        level: "",
        date: "",
        time: "",
        meetLink: "",
      });
    } catch (err) {
      console.error("CREATE SESSION ERROR:", err);
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        err.message
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-2xl font-bold text-[#2A4D6E] mb-4">
        Create New Session
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
          required
        />

        <input
          name="level"
          placeholder="Level"
          value={form.level}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
          required
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
          required
        />

        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
          required
        />

        <input
          name="meetLink"
          placeholder="Meeting Link"
          value={form.meetLink}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
          required
        />

        <button className="bg-[#C76B4A] text-white px-6 py-2 rounded-full hover:bg-[#8A4F7D] transition">
          Create Session
        </button>
      </form>
    </div>
  );
}
