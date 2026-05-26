"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    num: "01",
    title: "Payment primitives on Arc don't exist",
    desc: "Arc has USDC native, sub-1s finality, and Paymaster — but zero 'payment link' tools. This is the most critical missing layer.",
    badge: "Critical Gap",
    badgeColor: "bg-arc-orange",
  },
  {
    num: "02",
    title: "Stripe & PayPal exclude 450M+ people",
    desc: "450M+ in SEA, Africa, Latin America have no bank access. Stripe needs KYC. PayPal blocks developing nations. Freelancers lose 5-8% per transaction.",
    badge: "450M Excluded",
    badgeColor: "bg-arc-yellow",
  },
  {
    num: "03",
    title: "Web3 invoicing is still primitive",
    desc: "Request Network, Superfluid — all require volatile gas tokens, complex wallets, and lack consumer-grade UX. Adoption near-zero outside DeFi power users.",
    badge: "Poor UX/DX",
    badgeColor: "bg-arc-pink",
  },
  {
    num: "04",
    title: "B2B needs privacy — blockchain doesn't",
    desc: "Salaries, B2B invoices, sensitive deals can't be public on transparent chains. Arc has opt-in privacy — but no payment layer uses it.",
    badge: "Enterprise Blocker",
    badgeColor: "bg-arc-purple",
  },
];

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    tag: "Payment Links",
    tagColor: "bg-arc-green",
    title: "One-click payment links. Anyone can pay with USDC on Arc — no complex wallet. QR code, deep link, embed button.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    tag: "Smart Invoice",
    tagColor: "bg-arc-blue",
    title: "Invoice onchain with real-time tracking, auto payment terms, due date enforcement. Multi-item, discounts, programmable tax.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    tag: "Revenue Split",
    tagColor: "bg-arc-lime",
    title: "Auto-split to multiple addresses per link — co-founder shares, royalties, DAO treasury. Like 0xSplits but native Arc.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    tag: "Privacy Mode",
    tagColor: "bg-arc-purple",
    title: "Arc's opt-in privacy for sensitive B2B invoices. Amounts and parties shielded, audit-compliant for tax requirements.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    tag: "Cross-chain",
    tagColor: "bg-arc-orange",
    title: "Payers from Ethereum, Solana, or any chain pay via CCTP. ArcPay auto-bridges USDC to Arc. One invoice, pay from anywhere.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    tag: "Gasless",
    tagColor: "bg-arc-pink",
    title: "Circle Paymaster integration — payers don't need USDC for gas. Merchant or protocol subsidizes. Web2-level UX.",
  },
];

const badges = [
  { text: "Sub-1s Settlement", color: "bg-arc-green" },
  { text: "USDC as Gas", color: "bg-arc-blue" },
  { text: "Borderless", color: "bg-arc-lime" },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".problem-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
    gsap.from(".problem-card", { y: 80, opacity: 0, duration: 0.7, stagger: 0.12, ease: "back.out(1.4)", scrollTrigger: { trigger: ".problem-grid", start: "top 80%", once: true } });
    gsap.from(".solution-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".solution-section", start: "top 75%", once: true } });
    gsap.from(".feature-card", { y: 80, opacity: 0, duration: 0.7, stagger: 0.1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".features-grid", start: "top 80%", once: true } });
  }, []);

  return (
    <>
      <section ref={sectionRef} id="problem" className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="problem-heading text-center mb-16">
            <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">Why ArcPay Needs to Exist</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              Problem <span className="text-arc-orange">Statement</span>
            </h2>
          </div>

          <div className="problem-grid grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {problems.map((p) => (
              <div key={p.num} className="problem-card bg-arc-card neo-border-thick rounded-2xl p-6 sm:p-8 neo-shadow-lg hover:translate-y-[-4px] transition-transform duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl sm:text-5xl font-black text-arc-black/10 font-mono leading-none">{p.num}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold">{p.title}</h3>
                      <span className={`${p.badgeColor} neo-border rounded-lg px-3 py-1 font-mono text-[10px] font-black`}>{p.badge}</span>
                    </div>
                    <p className="text-sm text-arc-black/50 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="solution-section relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="solution-heading text-center mb-16">
            <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">ArcPay: The Missing Payment Layer</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {badges.map((badge, i) => (
                <span key={i} className={`${badge.color} neo-border-thick rounded-lg px-4 py-2 font-mono text-sm font-black`}>{badge.text}</span>
              ))}
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              This is crypto payments<br /><span className="gradient-text-green">done right.</span>
            </h2>
          </div>

          <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, i) => (
              <div key={i} className="feature-card bg-arc-card neo-border-thick rounded-2xl p-6 sm:p-8 neo-shadow-lg hover:translate-y-[-4px] transition-transform duration-200 group">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`${feature.tagColor} neo-border rounded-lg p-2.5 group-hover:scale-110 transition-transform duration-200`}>{feature.icon}</div>
                  <span className={`${feature.tagColor} neo-border rounded-lg px-3 py-1 font-mono text-xs font-black`}>{feature.tag}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold leading-snug">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
