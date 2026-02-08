import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import NoticeBoard from "../components/home/NoticeBoard";
import TutorCards from "../components/home/TutorCards";
import Features from "../components/home/Features";
import Pricing from "../components/home/Pricing";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div
      className="
        min-h-screen

        bg-slate-50
        text-slate-800

        dark:bg-black
        dark:text-slate-200

        selection:bg-slate-800
        selection:text-white

        transition-colors duration-500
      "
    >
      <Header />

      <main className="space-y-0">
        <Hero />
        <Stats />
        <NoticeBoard />
        <TutorCards />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
