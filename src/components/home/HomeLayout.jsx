import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function HomeLayout() {
  return (
    <div
      className="min-h-screen selection:bg-[var(--accent)]/30 selection:text-white"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
