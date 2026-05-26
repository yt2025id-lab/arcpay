"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const audiences = [
  {
    tag: "Freelancers",
    desc: "Different address for each client. No bank needed. Get paid in USDC, anywhere in the world.",
    color: "bg-arc-green",
    emoji: "💼",
    stat: "450M+",
    statLabel: "Unbanked",
  },
  {
    tag: "Creators",
    desc: "Sell digital products. Get paid anonymously. Auto-split royalties to collaborators.",
    color: "bg-arc-pink",
    emoji: "🎨",
    stat: "50M+",
    statLabel: "Creators",
  },
  {
    tag: "DAOs",
    desc: "Auto-split revenue to treasury & contributors. Transparent, onchain, programmable.",
    color: "bg-arc-purple",
    emoji: "🏛️",
    stat: "10K+",
    statLabel: "DAOs",
  },
  {
    tag: "Small Biz",
    desc: "Accept USDC payments. Keep finances private. No bank account or KYC required.",
    color: "bg-arc-blue",
    emoji: "📈",
    stat: "200M+",
    statLabel: "SMBs",
  },
];

export default function Audience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".audience-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
    gsap.from(".audience-card", { y: 80, opacity: 0, rotation: -3, duration: 0.7, stagger: 0.15, ease: "back.out(1.5)", scrollTrigger: { trigger: ".audience-grid", start: "top 80%", once: true } });
  }, []);

  return (
    <section ref={sectionRef} id="audience" className="relative py-20 sm:py-32 bg-arc-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="audience-heading text-center mb-16">
          <p className="font-mono text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Built For The People Stripe Left Behind</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Who Gets <span className="text-arc-green">Paid</span>
          </h2>
        </div>

        <div className="audience-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {audiences.map((audience, i) => (
            <div
              key={i}
              className="audience-card bg-arc-dark border border-white/10 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden group hover:border-white/20 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-5xl mb-4">{audience.emoji}</div>
                <h3 className={`${audience.color} neo-border inline-block rounded-lg px-4 py-2 font-mono text-sm font-black mb-4`}>{audience.tag}</h3>
                <p className="text-white/50 font-mono text-sm leading-relaxed mb-4">{audience.desc}</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-2xl font-black text-white font-mono">{audience.stat}</div>
                  <div className="text-white/30 font-mono text-[10px] font-bold uppercase tracking-wider">{audience.statLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
