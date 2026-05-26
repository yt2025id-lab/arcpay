"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const circleProducts = [
  {
    product: "USDC",
    desc: "Native settlement + gas currency. No volatile token exposure for merchants or payers.",
    integration: "Gas & settlement layer",
    color: "bg-arc-blue",
    impact: "Core",
  },
  {
    product: "Circle Wallets",
    desc: "Embedded wallets for payers without crypto. Email login → instant USDC payment. Web2 UX.",
    integration: "No-wallet onboarding",
    color: "bg-arc-green",
    impact: "High",
  },
  {
    product: "CCTP v2",
    desc: "Cross-chain USDC bridging. Payer from any chain, ArcPay settles on Arc seamlessly.",
    integration: "Multichain gateway",
    color: "bg-arc-purple",
    impact: "High",
  },
  {
    product: "Paymaster",
    desc: "Gasless transactions. Merchant or protocol subsidizes gas. Payer never needs USDC for fees.",
    integration: "Gasless UX",
    color: "bg-arc-pink",
    impact: "Critical",
  },
  {
    product: "Gateway",
    desc: "Off-chain data availability for metadata, invoice items, and private transaction data.",
    integration: "Metadata layer",
    color: "bg-arc-orange",
    impact: "Medium",
  },
  {
    product: "Nanopayments",
    desc: "Microtransaction support for pay-per-article, streaming, and fractional payments.",
    integration: "Micro-payment",
    color: "bg-arc-lime",
    impact: "Future",
  },
];

export default function CircleIntegration() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".circle-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
      gsap.from(".circle-card", { y: 60, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.3)", scrollTrigger: { trigger: ".circle-grid", start: "top 80%", once: true } });
      gsap.from(".circle-deep", { y: 40, opacity: 0, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: ".circle-deep", start: "top 85%", once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="circle-stack" className="relative py-20 sm:py-32 bg-arc-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="circle-heading text-center mb-16">
          <p className="font-mono text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Platform Alignment: 25% of Score</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-mono">
            Deep <span className="text-arc-green">Circle</span> Integration
          </h2>
          <p className="font-mono text-sm text-white/40 mt-4 max-w-xl mx-auto">
            6 Circle products integrated into one payment primitive. No other Arc project stacks this deep.
          </p>
        </div>

        <div className="circle-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {circleProducts.map((p) => (
            <div
              key={p.product}
              className="circle-card bg-arc-dark border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-arc-green/30 transition-all duration-300 group hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${p.color} neo-border rounded-lg px-3 py-1.5 font-mono text-xs font-black text-arc-black`}>
                    {p.product}
                  </div>
                  <span className={`font-mono text-[10px] font-bold rounded-md px-2 py-0.5 border ${
                    p.impact === "Critical" ? "text-arc-orange border-arc-orange/30 bg-arc-orange/10" :
                    p.impact === "High" ? "text-arc-green border-arc-green/30 bg-arc-green/10" :
                    p.impact === "Core" ? "text-arc-blue border-arc-blue/30 bg-arc-blue/10" :
                    "text-white/30 border-white/10"
                  }`}>
                    {p.impact}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-white/30 border border-white/10 rounded-md px-2 py-0.5">
                  {p.integration}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed font-mono">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="circle-deep bg-arc-green/10 border-2 border-arc-green/30 rounded-2xl p-8 sm:p-10">
          <h3 className="text-arc-green font-mono font-bold text-lg mb-6">Why this wins Platform Alignment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "6/7", label: "Circle products integrated", desc: "Only Programmable Wallets not yet — planned M2" },
              { stat: "100%", label: "USDC-native flow", desc: "Zero volatile token exposure for any party" },
              { stat: "0→1", label: "Payment primitive gap", desc: "First payment link tool on Arc ecosystem" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-arc-green font-mono">{item.stat}</div>
                <div className="text-white font-bold text-sm mt-1">{item.label}</div>
                <div className="text-white/40 font-mono text-xs mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
