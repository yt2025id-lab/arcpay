import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Audience from "@/components/Audience";
import CircleIntegration from "@/components/CircleIntegration";
import Architecture from "@/components/Architecture";
import Stats from "@/components/Stats";
import CompetitiveEdge from "@/components/CompetitiveEdge";
import Milestones from "@/components/Milestones";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Audience />
      <CircleIntegration />
      <Architecture />
      <Stats />
      <CompetitiveEdge />
      <Milestones />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <BackToTop />
    </>
  );
}
