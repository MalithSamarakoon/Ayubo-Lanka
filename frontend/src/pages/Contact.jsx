import React from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  const email = "AyuboLanka@gmail.com";
  const phone = "+94 71 123 4567"; 
  const address = "Galgamuwa, Sri Lanka";
  const hours = "Mon–Sat 9:00–18:00 (Sun closed)";
  const mapsOpenLink = "https://maps.app.goo.gl/Kw4moGKmn4QLiywZ8";
  const mapsEmbed =
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Galgamu Stores, Galgamuwa, Sri Lanka") +
    "&z=15&output=embed";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-white relative">
      
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000_30%,transparent_80%)]">
        <div className="mx-auto h-64 blur-3xl bg-emerald-200/40 rounded-full w-[70%]" />
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-900">Contact Us</h1>
          <p className="mt-2 text-emerald-800/80">We’d love to hear from you. Reach us using the details below.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-4">
            <ContactCard icon={<Mail className="text-emerald-700" />} title="Email" subtitle={email} href={`mailto:${email}`} cta="Email" />
            <ContactCard icon={<Phone className="text-emerald-700" />} title="Phone" subtitle={phone} href={`tel:${phone.replace(/\s/g, "")}`} cta="Call" />
            <ContactCard icon={<MapPin className="text-emerald-700" />} title="Address" subtitle={address} />
            <ContactCard icon={<Clock className="text-emerald-700" />} title="Hours" subtitle={hours} />

            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <MessageSquare className="text-emerald-700 mt-1" />
                <div>
                  <div className="text-emerald-900 font-semibold">Need more help?</div>
                  <p className="text-emerald-800/80 text-sm">For more information, go to the Support page.</p>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md"
                >
                  Go to Support
                </Link>
              </div>
            </div>
          </div>

          
          <div className="w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-white">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-emerald-200/30 via-transparent to-transparent blur-xl -z-10" />
              <div className="aspect-[16/10] w-full">
                <iframe
                  title="Galgamu Stores location"
                  src={mapsEmbed}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-3 text-right">
              <a
                href={mapsOpenLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({ icon, title, subtitle, href, cta }) {
  const content = (
    <div className="flex items-center gap-4">
      <span className="grid place-items-center h-11 w-11 rounded-xl bg-white border shadow-sm">
        {icon}
      </span>
      <div className="flex-1">
        <div className="text-emerald-900 font-semibold">{title}</div>
        <div className="text-emerald-800/80 text-sm">{subtitle}</div>
      </div>
      {href && cta && (
        <a
          href={href}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm shadow"
        >
          {cta}
        </a>
      )}
    </div>
  );

  return href ? (
    <a href={href} className="block bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
      {content}
    </a>
  ) : (
    <div className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">{content}</div>
  );
}
