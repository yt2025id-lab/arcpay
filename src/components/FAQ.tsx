"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "How does ArcPay work?",
    a: "When you create an ArcPay link, we deploy a smart contract that generates a unique payment address on Arc. Anyone can pay with USDC — settlement in <1 second. No bank, no KYC, no volatile gas tokens.",
  },
  {
    q: "What is a stealth address?",
    a: "A one-time derived address that lets someone send you crypto without knowing your real wallet. Each payment generates a fresh, unlinkable address that only you can claim.",
  },
  {
    q: "How do private payments work on Arc?",
    a: "ArcPay leverages Arc's opt-in privacy layer for B2B invoices. Amounts and parties are shielded from public view while remaining audit-compliant for tax requirements.",
  },
  {
    q: "Is ArcPay self-custodial?",
    a: "Yes, 100%. Your private keys never leave your device. We generate payment links without ever having access to your funds. We literally couldn't move your money even if we wanted to.",
  },
  {
    q: "Can I receive cross-chain USDC payments?",
    a: "Absolutely. ArcPay supports USDC from 10+ chains via CCTP — Ethereum, Solana, Arbitrum, Optimism, and more. All settled on Arc.",
  },
  {
    q: "How much does ArcPay cost?",
    a: "Creating payment links and invoices is free. We charge a minimal 0.1% protocol fee per transaction. No subscriptions, no hidden costs. Gas subsidized via Circle Paymaster.",
  },
  {
    q: "Does ArcPay have a token?",
    a: "We're focused on building the best payment primitive for Arc first. Future token utility (fee discounts via staking) is planned post-mainnet.",
  },
  {
    q: "Why build on Arc and not Ethereum/Solana?",
    a: "Arc offers USDC-native gas (no volatile token exposure), sub-1s deterministic finality, built-in Paymaster for gasless UX, and opt-in privacy. No other chain offers this combination for payments.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    gsap.from(".faq-heading", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } });
    gsap.from(".faq-item", { y: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ".faq-list", start: "top 80%", once: true } });
  }, []);

  useEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === openIndex) {
        el.style.maxHeight = el.scrollHeight + "px";
        el.style.opacity = "1";
      } else {
        el.style.maxHeight = "0px";
        el.style.opacity = "0";
      }
    });
  }, [openIndex]);

  return (
    <section ref={sectionRef} id="faq" className="relative py-20 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="faq-heading text-center mb-12 sm:mb-16">
          <p className="font-mono text-sm font-bold text-arc-black/40 uppercase tracking-widest mb-4">Got Questions?</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Frequently <span className="text-arc-blue">Asked</span>
          </h2>
        </div>

        <div className="faq-list space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item neo-border-thick rounded-2xl overflow-hidden transition-colors duration-200 ${
                openIndex === i ? "bg-arc-green/10" : "bg-arc-card"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-content-${i}`}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
              >
                <span className="font-bold text-base sm:text-lg pr-4">{faq.q}</span>
                <div className={`flex-shrink-0 w-8 h-8 neo-border rounded-lg flex items-center justify-center transition-all duration-200 ${
                  openIndex === i ? "bg-arc-green rotate-45" : "bg-arc-white"
                }`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>
              <div
                id={`faq-content-${i}`}
                ref={(el) => { contentRefs.current[i] = el; }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                role="region"
                aria-labelledby={`faq-question-${i}`}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 font-mono text-sm text-arc-black/60 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
