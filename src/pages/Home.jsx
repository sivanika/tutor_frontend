import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import NoticeBoard from "../components/home/NoticeBoard";
import TutorCards from "../components/home/TutorCards";
import Features from "../components/home/Features";
import Pricing from "../components/home/Pricing";
import Testimonials from "../components/home/Testimonials";
import ContactUs from "../components/home/ContactUs";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <NoticeBoard />
      <TutorCards />
      <Features />
      <Pricing />
      <Testimonials />
      <ContactUs />
      <CTA />
    </>
  );
}
