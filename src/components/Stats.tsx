"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 120, label: "Global B2B Payments ($T/yr)", prefix: "$", suffix: "T+" },
  { value: 1500, label: "Freelance Economy ($B/yr)", prefix: "$", suffix: "B+" },
  { value: 130, label: "SEA Remittance ($B/yr)", prefix: "$", suffix: "B+" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    stats.forEach((stat, i) => {
      const el = countersRef.current[i];
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        onUpdate: () => {
          if (el) el.textContent = `${stat.prefix}${Math.floor(obj.val).toLocaleString()}${stat.suffix}`;
        },
      });
    });

    gsap.from(".stat-card", {
      y: 60, opacity: 0, duration: 0.7, stagger: 0.15, ease: "back.out(1.7)",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest text-center mb-10">Market Size</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card bg-arc-card neo-border-thick rounded-2xl p-6 sm:p-8 text-center neo-shadow-lg">
              <span ref={(el) => { countersRef.current[i] = el; }} className="block text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-2 text-arc-green font-mono">
                {stat.prefix}0{stat.suffix}
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-arc-black/50 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
