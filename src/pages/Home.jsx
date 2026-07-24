import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import NoticeBoard from "../components/home/NoticeBoard";
import CourseCategories from "../components/home/CourseCategories";
import Features from "../components/home/Features";
import LearningRoadmap from "../components/home/LearningRoadmap";
import WhyChooseUs from "../components/home/WhyChooseUs";
import TutorCards from "../components/home/TutorCards";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";
import ContactUs from "../components/home/ContactUs";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <NoticeBoard />
      <CourseCategories />
      <Features />
      <LearningRoadmap />
      <WhyChooseUs />
      <TutorCards />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <ContactUs />
    </>
  );
}
