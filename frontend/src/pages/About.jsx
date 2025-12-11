import React, { useEffect, useMemo, useRef, useState } from "react";
import SafeImg from "../components/SafeImg.jsx";
import { Leaf, ShieldCheck, HeartHandshake, Stethoscope, Sparkles } from "lucide-react";

// Place your four images in frontend/public as hero1.jpg, hero2.jpg, hero3.jpg, hero4.jpg

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      {/* Decorative background aura */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000_30%,transparent_80%)]">
        <div className="mx-auto h-64 blur-3xl bg-emerald-200/40 rounded-full w-[70%]" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                <Sparkles size={14} /> Since Galgamuwa • Govt-approved Ayurveda
              </div>

              <div className="mt-3">
                <h2 className="text-xl font-semibold text-emerald-900">Who we are</h2>
                <p className="mt-2 text-green-700 text-lg md:text-xl">
                  Galgamu Stores is a government-approved Ayurvedic shop based in Galgamuwa. We’ve been serving the community
                  with authentic products and warm service for years. We operate in both wholesale and retail, across a wide
                  range of categories, while staying true to the traditions and quality of Ayurvedic wellness.
                </p>
              </div>

              {/* Trust badges moved below into a dedicated section */}
            </div>

            {/* Feature carousel */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-emerald-200/30 via-transparent to-transparent blur-xl -z-10" />
              <Carousel />
            </div>
          </div>

          {/* Top-left brand badge */}
          <div className="absolute top-4 left-6">
            <span
              className="inline-block bg-white/90 backdrop-blur rounded-full px-7 py-3 text-emerald-900 font-extrabold text-xl md:text-2xl shadow ring-1 ring-black/5 tracking-wide"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Galgamu Stores
            </span>
          </div>
        </div>
      </section>

      {/* Vision (Mission in your text block) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative bg-white rounded-3xl shadow-lg border border-green-100 p-8 md:p-10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300/70">
          <div className="absolute -top-4 -right-4 hidden md:flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs shadow">
            <Stethoscope size={14} /> Ayurveda + Digital Care
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Our Vision</h2>
          <p className="text-green-700 leading-relaxed">
            To develop a comprehensive Ayurvedic Medical Center web application that enhances operational efficiency for suppliers
            and administrators, while delivering a seamless and engaging customer experience through easy appointment booking,
            personalized product recommendations, and responsive support.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-4 md:py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="group bg-white rounded-3xl shadow-md border border-green-100 p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300/70">
            <h3 className="text-xl md:text-2xl font-semibold text-green-900 mb-3">Who we are</h3>
            <p className="text-green-700">
              As Galgamu Stores, we’ve built trust over the years as a reliable source for Sinhala Ayurvedic products.
              Today, we’re extending that trust online through AYUBO LANKA—giving you the privilege to shop our curated
              collection and to book Ayurvedic medical appointments from anywhere.
            </p>
            <CardRibbon />
          </div>

          <div className="group bg-white rounded-3xl shadow-md border border-green-100 p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300/70">
            <h3 className="text-xl md:text-2xl font-semibold text-green-900 mb-3">What we offer</h3>
            <p className="text-green-700">
              We sell both wholesale and retail, across categories ranging from daily wellness to specialized treatments.
              Our goal is to broaden our reach while preserving authenticity and care in every product and service we provide.
            </p>
            <CardRibbon right />
          </div>
        </div>
      </section>

      {/* Website capabilities */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-semibold text-emerald-900 mb-4">By using our website, you can</h3>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-emerald-800">
            {[
              "Browse Ayurvedic products by category",
              "See detailed product info with transparent pricing",
              "Add to cart and checkout with COD or bank slip",
              "Book doctor appointments online",
              "Use the AI assistant for quick help (English or Sinhala)",
              "Get personalized product recommendations",
              "Create support tickets and send feedback",
              "Track orders and view receipts",
              "Access a responsive experience on mobile & desktop",
            ].map((t) => (
              <li
                key={t}
                className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300/70"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Core values badges (replaces photo strip) */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h3 className="text-emerald-900 font-semibold mb-4">Our core values</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BigBadge icon={<ShieldCheck size={28} className="text-emerald-700" />} label="Government Approved" />
          <BigBadge icon={<Leaf size={28} className="text-emerald-700" />} label="Authentic & Herbal" />
          <BigBadge icon={<HeartHandshake size={28} className="text-emerald-700" />} label="Community Trusted" />
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Government Approved", desc: "Fully compliant and trusted by our local community." },
            { title: "Wholesale & Retail", desc: "Flexible purchasing for households and businesses alike." },
            { title: "Customer-Centric", desc: "We’re growing our base by focusing on quality and care." },
          ].map((h) => (
            <div
              key={h.title}
              className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300/70"
            >
              <h4 className="text-lg font-semibold text-green-900 mb-1">{h.title}</h4>
              <p className="text-green-700 text-sm">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- Small presentational helpers (in this file only) ---------- */

function Badge({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
      <span className="grid place-items-center h-5 w-5">{icon}</span>
      <span className="text-xs font-medium text-emerald-900">{label}</span>
    </div>
  );
}

function CardRibbon({ right = false }) {
  return (
    <div
      className={`mt-5 hidden md:block absolute ${
        right ? "-right-3" : "-left-3"
      } -bottom-3 rotate-1`}
    >
      <span className="inline-block bg-emerald-600 text-white text-[11px] px-3 py-1 rounded-md shadow">
        Ayurveda • Quality • Care
      </span>
    </div>
  );
}

// Simple, dependency-free carousel (enhanced styling/animation)
function Carousel() {
  const images = useMemo(
    () => [
      { src: "/hero1.jpg", alt: "Store shelves" },
      { src: "/hero2.jpg", alt: "Product racks" },
      { src: "/hero3.jpg", alt: "Bottled tonics" },
      { src: "/hero4.jpg", alt: "Traditional drawers" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, images.length]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="w-full h-80 md:h-[28rem] lg:h-[30rem] rounded-[1.75rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
        <div className="relative w-full h-full">
          <SafeImg
            key={images[index].src}
            src={images[index].src}
            alt={images[index].alt}
            className="w-full h-full object-cover will-change-transform transition-transform duration-[1800ms] ease-out scale-105 group-hover:scale-110"
          />
          {/* Subtle gradient overlay for text legibility if you add captions later */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>
      </div>

      {/* Controls */}
      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-emerald-900 shadow rounded-full w-11 h-11 grid place-items-center text-xl opacity-0 group-hover:opacity-100 transition"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-emerald-900 shadow rounded-full w-11 h-11 grid place-items-center text-xl opacity-0 group-hover:opacity-100 transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full ring-1 ring-black/10 transition ${
              i === index ? "bg-emerald-600" : "bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* Photo strip — shows all four images at once for a richer “with the photos” feel */
function BigBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-md">
      <span className="grid place-items-center h-8 w-8">{icon}</span>
      <span className="text-base font-semibold text-emerald-900">{label}</span>
    </div>
  );
}
