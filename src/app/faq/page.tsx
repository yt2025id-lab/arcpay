import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export const metadata = {
  title: "ArcPay — FAQ",
  description: "Frequently asked questions about ArcPay.",
};

export default function FAQPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <div className="pt-28 pb-8">
        <FAQ />
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}
