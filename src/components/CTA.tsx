"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const floatingAddresses = [
  { text: "0x9A12...C3dA", color: "bg-arc-green", rotate: "rotate-[-6deg]", top: "top-8", left: "left-[5%]" },
  { text: "USDC $150.00", color: "bg-arc-blue", rotate: "rotate-[4deg]", top: "top-4", left: "left-[40%]" },
  { text: "Invoice #042", color: "bg-arc-purple", rotate: "rotate-[8deg]", top: "top-12", left: "right-[8%]" },
  { text: "0x2E8D...F9gH", color: "bg-arc-lime", rotate: "rotate-[-3deg]", bottom: "bottom-8", left: "left-[12%]" },
  { text: "0x5H67...K3lM", color: "bg-arc-pink", rotate: "rotate-[6deg]", bottom: "bottom-4", left: "right-[15%]" },
];

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".cta-content", { y: 80, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
    gsap.from(".cta-floating-addr", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2)", scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true } });
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-content relative bg-arc-green neo-border-thick rounded-3xl p-10 sm:p-16 text-center neo-shadow-lg">
          {floatingAddresses.map((addr, i) => (
            <div key={i} className={`cta-floating-addr absolute hidden sm:block ${addr.top || ""} ${addr.bottom || ""} ${addr.left} ${addr.rotate}`}>
              <div className={`${addr.color} neo-border-thick rounded-xl px-3 py-2 neo-shadow font-mono text-xs font-black`}>{addr.text}</div>
            </div>
          ))}

          <p className="font-mono text-sm font-black text-arc-black/50 uppercase tracking-widest mb-6">Ready to build the future of payments?</p>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            If you scrolled this far,<br />It&apos;s time for you to<br />
            <span className="text-stroke">ARC IT UP!</span>
          </h2>

          <p className="font-mono text-base text-arc-black/60 max-w-lg mx-auto mb-8">
            Join the first payment primitive built natively for Arc. Create links, send invoices, split revenue — all in USDC, all in &lt;1s.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/app" className="inline-flex items-center gap-3 bg-arc-black text-arc-green neo-border-thick rounded-xl px-8 py-5 font-mono text-lg font-black neo-shadow-hover">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Launch App
            </a>
            <a href="/docs#milestones" className="inline-flex items-center gap-2 bg-arc-white text-arc-black neo-border-thick rounded-xl px-8 py-5 font-mono text-lg font-black neo-shadow-hover">
              View Roadmap
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
