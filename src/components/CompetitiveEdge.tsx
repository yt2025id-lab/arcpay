"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const competitors = [
  {
    name: "Stripe / PayPal",
    issue: "Requires bank, KYC enterprise, excludes 450M+ people",
    arcpay: "Permissionless, USDC native, no bank needed",
  },
  {
    name: "Request Network",
    issue: "Complex UX, volatile gas tokens, multi-chain fragmented",
    arcpay: "Simple link, Arc-native, gasless via Paymaster",
  },
  {
    name: "Superfluid",
    issue: "Streaming only, no payment links or invoices",
    arcpay: "Full payment primitive: links + invoices + splits",
  },
  {
    name: "0xSplits",
    issue: "No payment link, no invoice, no privacy mode",
    arcpay: "Split built-in + privacy + cross-chain via CCTP",
  },
];

const monetization = [
  { model: "Protocol Fee", desc: "0.1% per transaction (merchant-side)", tier: "Core Revenue", icon: "💰" },
  { model: "Premium API", desc: "Advanced analytics, SLA, priority support", tier: "B2B SaaS", icon: "📊" },
  { model: "White Label", desc: "Fintech & marketplace can embed ArcPay", tier: "Enterprise", icon: "🏢" },
  { model: "ARC Token Utility", desc: "Staking ARC → fee discount (post-mainnet)", tier: "Ecosystem", icon: "⚡" },
];

export default function CompetitiveEdge() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".comp-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
      gsap.from(".comp-row", { y: 40, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".comp-table", start: "top 80%", once: true } });
      gsap.from(".monetize-card", { y: 40, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".monetize-grid", start: "top 85%", once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="competitive" className="relative py-20 sm:py-32 bg-arc-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="comp-heading text-center mb-16">
          <p className="font-mono text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Ecosystem Impact: 25% of Score</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            Competitive <span className="text-arc-green">Advantage</span>
          </h2>
          <p className="font-mono text-sm text-white/40 mt-4 max-w-xl mx-auto">
            ArcPay is the only protocol that combines payment links, smart invoices, privacy, and cross-chain — all native to Arc.
          </p>
        </div>

        <div className="comp-table mb-12">
          {competitors.map((c) => (
            <div key={c.name} className="comp-row bg-arc-dark border border-white/10 rounded-xl p-5 mb-3 hover:border-white/20 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-white font-bold text-sm shrink-0 w-36">{c.name}</span>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 flex-1 text-sm font-mono">
                  <span className="text-red-400/80 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-400/60 rounded-full shrink-0" />
                    {c.issue}
                  </span>
                  <span className="text-arc-green text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-arc-green rounded-full shrink-0" />
                    ArcPay: {c.arcpay}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-white font-bold text-xl font-mono">Monetization Model</h3>
          <p className="font-mono text-xs text-white/30 mt-1">Sustainable revenue from day one of mainnet</p>
        </div>

        <div className="monetize-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {monetization.map((m) => (
            <div key={m.model} className="monetize-card bg-arc-dark border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{m.icon}</span>
                <span className="bg-arc-blue/15 text-arc-blue border border-arc-blue/20 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold">{m.tier}</span>
              </div>
              <span className="text-white font-bold text-sm block mb-1">{m.model}</span>
              <p className="text-white/40 font-mono text-xs">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-arc-green/10 border-2 border-arc-green/30 rounded-2xl p-6 sm:p-8">
          <h4 className="text-arc-green font-mono font-bold text-base mb-4">Why ArcPay = Priority for Arc Ecosystem</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Payment link is the easiest onramp for non-crypto merchants → Arc ecosystem",
              "Every invoice = USDC locked on Arc = organic TVL increase",
              "Open source → composable by other Arc builders",
              "Real-world demo Circle can use in marketing & roadshow",
              "SEA angle: showcase Arc to 650M people who need this most",
            ].map((p, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-arc-green shrink-0 font-bold">✓</span>
                <span className="text-white/60 text-sm font-mono">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
