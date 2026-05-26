"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    phase: "M1",
    title: "Foundation & Core Protocol",
    duration: "Month 1-3",
    grant: "$30K",
    color: "bg-arc-green",
    borderColor: "border-arc-green",
    deliverables: [
      "Deploy PaymentLink.sol & Invoice.sol to Arc testnet",
      "Unit test coverage >90%",
      "Security audit internal (Slither, Mythril)",
      "REST API v1: /payment-links, /invoices",
      "Developer docs & API reference",
      "5 developers onboarded (testnet)",
    ],
    kpi: "50+ payment links created on testnet",
  },
  {
    phase: "M2",
    title: "SDK, Split & Cross-chain",
    duration: "Month 4-6",
    grant: "$50K",
    color: "bg-arc-blue",
    borderColor: "border-arc-blue",
    deliverables: [
      "SplitRouter.sol + EscrowVault.sol deployed",
      "@arcpay/sdk JS/TS package (npm)",
      "CCTP integration: pay from Ethereum/Solana",
      "Circle Wallets API integration",
      "Gasless mode via Circle Paymaster",
      "Embeddable payment widget",
      "Privacy mode for B2B invoice",
    ],
    kpi: "$10K+ volume on testnet, 20+ developers",
  },
  {
    phase: "M3",
    title: "Production, GTM & Ecosystem",
    duration: "Month 7-9",
    grant: "$70K",
    color: "bg-arc-yellow",
    borderColor: "border-arc-yellow",
    deliverables: [
      "External security audit (Certik/OtterSec)",
      "Bug bounty program launch",
      "Merchant analytics dashboard",
      "Mobile SDK (React Native)",
      "3+ pilot merchant live",
      "Arc mainnet deployment",
      "Open source + contributor guidelines",
      "Co-marketing with Circle",
    ],
    kpi: "100+ active merchant, $100K+ real USDC volume",
  },
];

export default function Milestones() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".milestone-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
    gsap.from(".milestone-card", { y: 60, opacity: 0, duration: 0.7, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: ".milestone-list", start: "top 80%", once: true } });
    gsap.from(".milestone-total", { scale: 0.8, opacity: 0, duration: 0.7, ease: "back.out(1.7)", scrollTrigger: { trigger: ".milestone-total", start: "top 85%", once: true } });
  }, []);

  return (
    <section ref={sectionRef} id="milestones" className="relative py-20 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="milestone-heading text-center mb-16">
          <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">9 Month Roadmap</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Milestones & <span className="text-arc-green">Grant</span>
          </h2>
        </div>

        <div className="milestone-list flex flex-col gap-5">
          {milestones.map((m, idx) => (
            <div key={m.phase} className="milestone-card relative">
              <div className="bg-arc-card neo-border-thick rounded-2xl p-6 sm:p-8 neo-shadow-lg hover:translate-y-[-2px] transition-transform duration-200">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`${m.color} neo-border rounded-lg px-3 py-1 font-mono text-xs font-black`}>{m.phase}</span>
                      <h3 className="font-bold text-lg">{m.title}</h3>
                    </div>
                    <p className="font-mono text-xs text-arc-black/40">{m.duration}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl sm:text-3xl font-black text-arc-green">{m.grant}</div>
                    <p className="font-mono text-[10px] text-arc-black/30 font-bold">USDC disbursement</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {m.deliverables.map((d) => (
                    <div key={d} className="flex gap-2">
                      <span className="text-arc-green text-xs mt-0.5 shrink-0 font-bold">▸</span>
                      <span className="text-arc-black/60 text-sm font-mono">{d}</span>
                    </div>
                  ))}
                </div>

                <div className={`${m.color} neo-border rounded-xl px-4 py-2 flex items-center gap-2`}>
                  <span className="font-mono text-xs font-black">KPI:</span>
                  <span className="font-mono text-xs font-bold">{m.kpi}</span>
                </div>
              </div>

              {idx < milestones.length - 1 && (
                <div className="hidden sm:flex absolute -bottom-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-10 h-10 bg-arc-white neo-border rounded-full flex items-center justify-center neo-shadow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="milestone-total mt-8 bg-arc-green/10 border-2 border-arc-green/30 rounded-2xl p-6 sm:p-8 text-center">
          <p className="font-mono text-xs font-bold text-arc-black/40 uppercase tracking-widest mb-2">Total Grant Request</p>
          <div className="text-4xl sm:text-5xl font-black text-arc-green font-mono mb-2">$150K USDC</div>
          <p className="font-mono text-sm text-arc-black/50">9 months. 3 milestones. From testnet to mainnet with real merchants.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <span className="bg-arc-green neo-border rounded-lg px-3 py-1.5 font-mono text-xs font-black">$30K M1</span>
            <span className="text-arc-black/20 font-black">+</span>
            <span className="bg-arc-blue neo-border rounded-lg px-3 py-1.5 font-mono text-xs font-black">$50K M2</span>
            <span className="text-arc-black/20 font-black">+</span>
            <span className="bg-arc-yellow neo-border rounded-lg px-3 py-1.5 font-mono text-xs font-black">$70K M3</span>
          </div>
        </div>
      </div>
    </section>
  );
}
