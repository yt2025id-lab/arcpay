"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const links = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
    { href: "#circle-stack", label: "Circle Stack" },
    { href: "#architecture", label: "Architecture" },
    { href: "#milestones", label: "Roadmap" },
    { href: "#faq", label: "FAQ" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".nav-logo", { y: -30, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
      tl.from(".nav-link", { y: -20, opacity: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }, "-=0.3");
      tl.from(".nav-cta", { scale: 0.8, opacity: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2");
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-arc-white/95 backdrop-blur-lg neo-border-thick border-t-0 border-l-0 border-r-0 shadow-[0_4px_0_0_#1a1a1a]"
          : "bg-arc-white/80 backdrop-blur-md border-b border-arc-black/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="nav-logo flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-arc-green neo-border rounded-lg flex items-center justify-center neo-shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              ARC<span className="text-arc-green">Pay</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-5">
            {links.map((l) => {
              const id = l.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`nav-link font-mono text-[13px] font-bold transition-all duration-200 relative ${
                    isActive
                      ? "text-arc-green"
                      : "text-arc-black/60 hover:text-arc-green"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-arc-green rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a href="#cta" className="nav-cta bg-arc-green neo-border-thick rounded-xl px-5 py-2.5 font-mono text-sm font-black neo-shadow-hover hidden sm:inline-flex">
              Launch App
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 neo-border rounded-lg flex items-center justify-center bg-arc-white"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {mobileOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-arc-white neo-border-thick border-t-0 border-l-0 border-r-0 px-4 pb-4">
          {links.map((l) => {
            const id = l.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 font-mono text-sm font-bold border-b border-arc-black/5 last:border-0 transition-colors ${
                  isActive ? "text-arc-green" : "text-arc-black/70 hover:text-arc-green"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a href="#cta" onClick={() => setMobileOpen(false)} className="block mt-3 bg-arc-green neo-border-thick rounded-xl px-5 py-3 font-mono text-sm font-black text-center neo-shadow">
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}
