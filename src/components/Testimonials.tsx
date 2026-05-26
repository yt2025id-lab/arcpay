"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    handle: "jordan.eth",
    role: "Freelance Designer",
    emoji: "💼",
    quote: "I sent a payment link to my client in Jakarta. They paid in USDC, I received it in <1s. No PayPal hold, no 5% fee cut. Game changer.",
    color: "bg-arc-green",
  },
  {
    handle: "casey.arc",
    role: "Digital Creator",
    emoji: "🎨",
    quote: "I sell Notion templates with ArcPay links. Each sale auto-splits 10% to my co-creator. Zero manual accounting. Privacy mode keeps my earnings private.",
    color: "bg-arc-pink",
  },
  {
    handle: "jamie.dao",
    role: "DAO Treasury Ops",
    emoji: "🏛️",
    quote: "Our DAO uses ArcPay to split revenue across 12 contributors. Revenue hits the contract, splits auto-route. We used to do this manually — took hours.",
    color: "bg-arc-purple",
  },
  {
    handle: "alex.dev",
    role: "Smart Contract Dev",
    emoji: "💻",
    quote: "The SDK is clean. Integrated ArcPay into our marketplace in 2 hours. Gasless via Paymaster means our users never need to hold USDC for gas.",
    color: "bg-arc-blue",
  },
  {
    handle: "taylor.sea",
    role: "Startup Founder",
    emoji: "🚀",
    quote: "We couldn't get Stripe in Vietnam. ArcPay let us accept USDC payments from day one. No KYC, no bank, no 30-day wait. We're live.",
    color: "bg-arc-lime",
  },
  {
    handle: "morgan.b2b",
    role: "Enterprise CFO",
    emoji: "📊",
    quote: "Privacy mode invoices mean our B2B deals stay off-chain. Audit-compliant for tax, invisible to competitors. This is what enterprise crypto payments should look like.",
    color: "bg-arc-orange",
  },
  {
    handle: "river.cross",
    role: "DeFi Researcher",
    emoji: "⚡",
    quote: "CCTP cross-chain is seamless. My clients pay from Ethereum or Solana, I settle on Arc. One invoice, any chain. The future is chain-agnostic.",
    color: "bg-arc-yellow",
  },
  {
    handle: "quinn.nfp",
    role: "Nonprofit Director",
    emoji: "🌍",
    quote: "We receive donations from 15 countries. ArcPay gives each donor a unique link, auto-receipts, and full transparency. No intermediary takes a cut.",
    color: "bg-arc-green",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".testimonials-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
  }, []);

  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4);

  const renderCard = (t: (typeof testimonials)[0]) => (
    <div className="flex-shrink-0 w-80 bg-arc-card neo-border-thick rounded-2xl p-6 neo-shadow-lg hover:translate-y-[-2px] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${t.color} neo-border rounded-lg w-10 h-10 flex items-center justify-center text-lg`}>
          {t.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm font-black truncate">{t.handle}</p>
          <p className="font-mono text-[11px] text-arc-black/40 font-bold">{t.role}</p>
        </div>
      </div>
      <p className="text-sm text-arc-black/70 leading-relaxed font-mono">&ldquo;{t.quote}&rdquo;</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="testimonials-heading text-center mb-12">
          <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">Real Use Cases</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Who Gets <span className="text-arc-green">Paid</span> with ArcPay
          </h2>
          <p className="font-mono text-sm text-arc-black/40 mt-4 max-w-lg mx-auto">
            From freelancers in Vietnam to DAOs in Singapore — ArcPay works for everyone, everywhere.
          </p>
        </div>
      </div>
      <div className="mb-4 overflow-hidden">
        <div className="marquee-track">{[...row1, ...row1, ...row1].map((t, i) => <div key={i}>{renderCard(t)}</div>)}</div>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track-reverse">{[...row2, ...row2, ...row2].map((t, i) => <div key={i}>{renderCard(t)}</div>)}</div>
      </div>
    </section>
  );
}
