import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function HomeLayout() {
  return (
    <div
      className="
        min-h-screen
        bg-white
        text-[var(--text-primary)]
        dark:bg-[var(--surface)]
        dark:text-[var(--text-primary)]
        selection:bg-[var(--primary)]
        selection:text-white
        transition-colors duration-500
      "
    >
      <Header />
      <main className="space-y-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
