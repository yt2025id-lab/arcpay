"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(".hero-badge", { y: 40, opacity: 0, duration: 0.7, ease: "back.out(1.7)" });
      tl.from(".hero-title-line", { y: 80, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
      tl.from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
      tl.from(".hero-cta", { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.2");
      tl.from(".hero-stat", { y: 40, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.2");
      tl.from(".hero-float", { scale: 0.8, opacity: 0, duration: 1, ease: "elastic.out(1, 0.5)" }, "-=0.4");
      tl.from(".hero-trust", { y: 30, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }, "-=0.2");
      tl.from(".hero-cred", { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.2");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-arc-green/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-arc-blue/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-arc-yellow/8 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-32 left-[5%] hero-float z-10 animate-float hidden sm:block">
        <div className="bg-arc-lime neo-border-thick rounded-2xl p-3 neo-shadow-lg rotate-[-8deg]">
          <span className="font-mono font-black text-sm">0x9A12...C3dA</span>
        </div>
      </div>
      <div className="absolute top-48 right-[4%] hero-float z-10 animate-float-delay hidden sm:block">
        <div className="bg-arc-pink neo-border-thick rounded-2xl p-3 neo-shadow-lg rotate-[6deg]">
          <span className="font-mono font-black text-sm">USDC $150.00</span>
        </div>
      </div>
      <div className="absolute bottom-32 left-[8%] hero-float z-10 animate-float-delay hidden md:block">
        <div className="bg-arc-blue neo-border-thick rounded-2xl p-3 neo-shadow-lg rotate-[12deg]">
          <span className="font-mono font-black text-sm">&lt;1s finality</span>
        </div>
      </div>
      <div className="absolute bottom-40 right-[6%] hero-float z-10 animate-float hidden md:block">
        <div className="bg-arc-purple neo-border-thick rounded-2xl p-3 neo-shadow-lg rotate-[-5deg]">
          <span className="font-mono font-black text-sm">Invoice #042</span>
        </div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="hero-badge inline-flex items-center gap-2 bg-arc-green neo-border-thick rounded-full px-5 py-2 mb-8 neo-shadow">
          <div className="w-2 h-2 bg-arc-black rounded-full animate-pulse-dot" />
          <span className="font-mono text-xs sm:text-sm font-black">THE PAYMENT LAYER FOR ARC</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-6">
          <span className="hero-title-line block">Get Paid</span>
          <span className="hero-title-line block gradient-text-green">On Arc</span>
        </h1>

        <p className="hero-subtitle text-lg sm:text-xl md:text-2xl font-mono font-medium text-arc-black/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Payment links & invoices onchain. USDC native. Sub-1s settlement. No bank needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a href="#how-it-works" className="hero-cta bg-arc-green neo-border-thick rounded-xl px-8 py-4 font-mono text-lg font-black neo-shadow-hover inline-flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Create Payment Link
          </a>
          <a href="#circle-stack" className="hero-cta bg-arc-white neo-border-thick rounded-xl px-8 py-4 font-mono text-lg font-black neo-shadow-hover inline-flex items-center gap-2">
            View Circle Integration
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {["USDC Native", "Arc L1", "Open Source", "EVM Compatible", "Circle Stack"].map((tag) => (
            <span key={tag} className="hero-trust bg-arc-black/5 border border-arc-black/10 rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold text-arc-black/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
          {[
            { value: "$150K", label: "Grant Target" },
            { value: "450M+", label: "Unbanked Adults" },
            { value: "9 mo", label: "To Production" },
            { value: "6", label: "Circle Products" },
          ].map((stat, i) => (
            <div key={i} className="hero-stat bg-arc-card neo-border-thick rounded-xl p-4 neo-shadow">
              <div className="text-2xl sm:text-3xl font-black text-arc-green font-mono">{stat.value}</div>
              <div className="text-xs font-mono font-bold text-arc-black/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="hero-cred bg-arc-black neo-border-thick rounded-lg px-4 py-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D084" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-mono text-xs font-bold text-arc-green">Self-Custodial</span>
          </div>
          <div className="hero-cred bg-arc-black neo-border-thick rounded-lg px-4 py-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="font-mono text-xs font-bold text-arc-blue">Cross-chain</span>
          </div>
          <div className="hero-cred bg-arc-black neo-border-thick rounded-lg px-4 py-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="font-mono text-xs font-bold text-arc-pink">Gasless</span>
          </div>
        </div>
      </div>
    </section>
  );
}
