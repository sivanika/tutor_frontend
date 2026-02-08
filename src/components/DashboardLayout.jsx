import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

function DashboardLayout({ children, role }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
