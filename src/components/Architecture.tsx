"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Architecture() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".arch-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
    gsap.from(".arch-layer", { y: 50, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: ".arch-diagram", start: "top 80%", once: true } });
    gsap.from(".arch-flow-item", { x: -30, opacity: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ".arch-flow", start: "top 85%", once: true } });
  }, []);

  const layer3 = ["Web App (Next.js)", "Mobile SDK", "Merchant Dashboard", "REST + GraphQL API", "Embeddable Widget", "CLI Tools"];
  const layer2 = ["PaymentLink.sol", "Invoice.sol", "SplitRouter.sol", "EscrowVault.sol", "PrivacyShield.sol", "FeeManager.sol"];
  const layer1 = ["Arc Blockchain (L1)", "USDC (gas + settlement)", "Circle Wallets API", "CCTP v2", "Paymaster", "Gateway", "Nanopayments"];

  const flowSteps = [
    { label: "Merchant creates invoice", color: "bg-arc-blue text-arc-black" },
    { label: "ArcPay deploys PayLink", color: "bg-arc-green text-arc-black" },
    { label: "Payer opens link", color: "bg-arc-blue text-arc-black" },
    { label: "USDC transfer on Arc", color: "bg-arc-green text-arc-black" },
    { label: "Sub-1s finality", color: "bg-arc-lime text-arc-black" },
    { label: "Webhook + notification", color: "bg-arc-yellow text-arc-black" },
    { label: "Split / escrow / direct", color: "bg-arc-green text-arc-black" },
  ];

  return (
    <section ref={sectionRef} id="architecture" className="relative py-20 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="arch-heading text-center mb-16">
          <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">Three integrated layers with Circle full-stack</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Technical <span className="text-arc-green">Architecture</span>
          </h2>
        </div>

        <div className="arch-diagram flex flex-col gap-2 mb-12">
          <div className="arch-layer bg-[#E8F4FD] neo-border-thick rounded-xl p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-arc-blue/10 rounded-bl-full" />
            <div className="relative z-10">
              <p className="font-mono text-xs font-bold text-arc-blue mb-3 uppercase tracking-wider">Layer 3 — Application</p>
              <div className="flex flex-wrap gap-2">
                {layer3.map((t) => (
                  <span key={t} className="bg-white neo-border rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-1">
            <div className="flex-1 h-px bg-arc-black/10" />
            <div className="w-8 h-8 bg-arc-white neo-border rounded-full flex items-center justify-center text-xs font-mono font-black text-arc-black/30">↕</div>
            <div className="flex-1 h-px bg-arc-black/10" />
          </div>

          <div className="arch-layer bg-[#E8F8F0] neo-border-thick rounded-xl p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-arc-green/10 rounded-bl-full" />
            <div className="relative z-10">
              <p className="font-mono text-xs font-bold text-arc-green mb-3 uppercase tracking-wider">Layer 2 — ArcPay Protocol (Smart Contracts)</p>
              <div className="flex flex-wrap gap-2">
                {layer2.map((t) => (
                  <span key={t} className="bg-white neo-border rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold text-arc-green">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-1">
            <div className="flex-1 h-px bg-arc-black/10" />
            <div className="w-8 h-8 bg-arc-white neo-border rounded-full flex items-center justify-center text-xs font-mono font-black text-arc-black/30">↕</div>
            <div className="flex-1 h-px bg-arc-black/10" />
          </div>

          <div className="arch-layer bg-[#F0E8FD] neo-border-thick rounded-xl p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-arc-purple/10 rounded-bl-full" />
            <div className="relative z-10">
              <p className="font-mono text-xs font-bold text-arc-purple mb-3 uppercase tracking-wider">Layer 1 — Circle Developer Stack</p>
              <div className="flex flex-wrap gap-2">
                {layer1.map((t) => (
                  <span key={t} className="bg-white neo-border rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold text-arc-purple">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-arc-card neo-border-thick rounded-xl p-5 sm:p-6 neo-shadow-lg">
          <p className="font-mono text-xs text-arc-black/40 mb-4 font-bold uppercase tracking-wider">Payment Flow — Happy Path</p>
          <div className="arch-flow flex flex-wrap items-center gap-2">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`arch-flow-item font-mono text-[11px] font-black neo-border rounded-md px-2.5 py-1.5 ${step.color}`}>
                  {i + 1}. {step.label}
                </span>
                {i < flowSteps.length - 1 && <span className="text-arc-black/20 text-xs font-black">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
