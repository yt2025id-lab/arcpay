import Navbar from "@/components/Navbar";
import Audience from "@/components/Audience";
import CircleIntegration from "@/components/CircleIntegration";
import Architecture from "@/components/Architecture";
import Stats from "@/components/Stats";
import CompetitiveEdge from "@/components/CompetitiveEdge";
import Milestones from "@/components/Milestones";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export const metadata = {
  title: "ArcPay — Documentation & Deep Dive",
  description: "Architecture, Circle integration, roadmap, competitive edge, and more.",
};

export default function DocsPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            ArcPay <span className="text-arc-green">Docs</span>
          </h1>
          <p className="text-lg text-arc-black/50 font-mono mb-12">
            Deep dive into architecture, integrations, roadmap, and competitive edge.
          </p>

          <nav className="flex flex-wrap gap-3 mb-16">
            {[
              { href: "#audience", label: "Target Users" },
              { href: "#circle-stack", label: "Circle Stack" },
              { href: "#architecture", label: "Architecture" },
              { href: "#market-size", label: "Market Size" },
              { href: "#competitive-edge", label: "Competitive Edge" },
              { href: "#milestones", label: "Roadmap" },
              { href: "#testimonials", label: "Testimonials" },
              { href: "#faq", label: "FAQ" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="bg-arc-card neo-border-thick rounded-lg px-4 py-2 font-mono text-sm font-bold hover:-translate-y-0.5 transition-transform"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <Audience />
        <CircleIntegration />
        <Architecture />
        <Stats />
        <CompetitiveEdge />
        <Milestones />
        <Testimonials />
        <FAQ />
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}
