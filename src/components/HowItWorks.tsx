"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "1",
    title: "Merchant creates link",
    desc: "Generate a payment link or invoice in 30 seconds. Set amount, privacy mode, and split config.",
    color: "bg-arc-green",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Share & payer opens",
    desc: "Share URL, QR code, or embed button. Payer opens from any device — no wallet setup needed with Circle Wallets.",
    color: "bg-arc-blue",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "USDC payment on Arc",
    desc: "Payer sends USDC. Gasless via Paymaster. Cross-chain via CCTP. Any chain, one invoice.",
    color: "bg-arc-yellow",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: "4",
    title: "Sub-1s settlement",
    desc: "Arc deterministic finality. Merchant receives USDC instantly. Split auto-distributes. Webhook fires.",
    color: "bg-arc-pink",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hiw-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
      gsap.from(".hiw-step", { y: 60, opacity: 0, duration: 0.7, stagger: 0.15, ease: "back.out(1.4)", scrollTrigger: { trigger: ".hiw-grid", start: "top 80%", once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hiw-heading text-center mb-16">
          <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">From link to settlement in seconds</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            How It <span className="text-arc-green">Works</span>
          </h2>
        </div>

        <div className="hiw-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {steps.map((step) => (
            <div key={step.num} className="hiw-step relative">
              <div className="bg-arc-card neo-border-thick rounded-2xl p-6 sm:p-8 neo-shadow-lg h-full">
                <div className={`${step.color} neo-border rounded-xl w-12 h-12 flex items-center justify-center mb-5`}>
                  {step.icon}
                </div>
                <div className={`${step.color} neo-border rounded-lg px-3 py-1 font-mono text-xs font-black inline-block mb-3`}>
                  Step {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-arc-black/50 leading-relaxed font-mono">{step.desc}</p>
              </div>
              {step.num !== "4" && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="bg-arc-black text-arc-white w-6 h-6 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-arc-card neo-border-thick rounded-2xl p-6 sm:p-8 neo-shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-arc-green neo-border rounded-xl p-3 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-base mb-1">Cross-chain? No problem.</h4>
              <p className="text-sm text-arc-black/50 font-mono leading-relaxed">
                Payer on Ethereum or Solana? CCTP bridges USDC to Arc automatically. One invoice, pay from any chain. Settlement still &lt;1s on Arc.
              </p>
            </div>
            <a href="/docs#architecture" className="bg-arc-yellow neo-border-thick rounded-xl px-5 py-2.5 font-mono text-sm font-black neo-shadow-hover shrink-0">
              See Architecture
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
