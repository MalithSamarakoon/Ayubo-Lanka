import ayurvedicProduct from "../models/product.model.js";
import { User } from "../models/user.model.js";

// Uses Node 18+ global fetch
const GEMINI_BASES = [
  "https://generativelanguage.googleapis.com/v1/models",
  "https://generativelanguage.googleapis.com/v1beta/models",
];
const PREFERRED_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro",
];

async function listModels(apiKey) {
  for (const BASE of GEMINI_BASES) {
    const url = `${BASE}?key=${encodeURIComponent(apiKey)}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const data = await resp.json();
      const models = data?.models || [];
      if (models.length) return { models, base: BASE };
    } catch (_) {
      // try next BASE
    }
  }
  return { models: [], base: GEMINI_BASES[0] };
}

function pickModel(models) {
  // filter models that support generateContent
  const withGen = models.filter((m) => Array.isArray(m?.supportedGenerationMethods) ? m.supportedGenerationMethods.includes("generateContent") : (m?.generationMethods || []).includes("generateContent"));
  // Prefer PREFERRED_MODELS order
  for (const name of PREFERRED_MODELS) {
    const found = withGen.find((m) => m?.name?.endsWith(`/models/${name}`) || m?.name === name || m?.displayName === name);
    if (found) return found;
  }
  // otherwise, prefer anything with 'flash' then any
  const flash = withGen.find((m) => /flash/i.test(m?.name || m?.displayName || ""));
  if (flash) return flash;
  return withGen[0] || null;
}

export const askChat = async (req, res) => {
  try {
    const apiKeyRaw = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    const apiKey = apiKeyRaw.trim();
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "AI is not configured. Set GEMINI_API_KEY in .env" });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "message is required" });
    }

    // Easter egg: handle "who is raja?" with a playful fixed reply
    try {
      const norm = String(message).trim().toLowerCase();
      if (/\bwho\s+is\s+raja\b\??/.test(norm)) {
        const reply = "you dont know about Raja, the king of SLIIT, Oooph, so sad, He is the genious who behind all of this, The creater of me, do some research bro....";
        return res.json({ reply, easterEgg: true });
      }
    } catch (_) {
      // ignore and continue
    }

    // Pull a compact product catalog for accurate price/details answers (limit to keep prompt small)
    const products = await ayurvedicProduct
      .find({}, "name category price description")
      .limit(40)
      .lean();

    const catalogLines = (products || []).map((p) => {
      const price = typeof p.price === "number" ? p.price.toFixed(2) : p.price;
      return `- ${p.name} | Category: ${p.category || "-"} | Price: Rs. ${price} | ${
        p.description ? p.description.slice(0, 180) : ""
      }`;
    });

  // Pull a compact doctors list (approved doctors only) for appointments and doctor info answers
  const doctors = await User.find(
    { role: "DOCTOR", isApproved: true },
    "name specialization experience consultationFee availability companyAddress mobile doctorLicenseNumber email"
  )
    .limit(40)
    .lean();

  const doctorLines = (doctors || []).map((d) => {
    const exp = typeof d.experience === "number" ? `${d.experience} yrs` : d.experience || "";
    const fee = typeof d.consultationFee === "number" ? `Rs. ${d.consultationFee.toFixed(2)}` : d.consultationFee || "";
    const avail = d.availability ? d.availability.replace(/_/g, " ") : "";
    const addr = d.companyAddress || "";
    const phone = d.mobile || "";
    const lic = d.doctorLicenseNumber || "";
    const spec = d.specialization || "General Practice";
    const parts = [
      `${d.name} (${spec})`,
      exp && `Exp: ${exp}`,
      fee && `Fee: ${fee}`,
      avail && `Availability: ${avail}`,
      addr && `Address: ${addr}`,
      phone && `Phone: ${phone}`,
      lic && `License: ${lic}`,
      d.email && `Email: ${d.email}`,
    ].filter(Boolean);
    return `- ${parts.join(" | ")}`;
  });

  const siteInfo = `Brand: Ayubo Lanka (operated by Galgamu Stores)\n`
    + `Store: Galgamu Stores — a government-approved Ayurvedic shop in Galgamuwa, Sri Lanka.\n`
    + `Location: Galgamuwa, Sri Lanka. Google Maps: https://maps.app.goo.gl/Kw4moGKmn4QLiywZ8\n`
    + `Contact: Email: AyuboLanka@gmail.com | Phone: +94 71 123 4567\n`
    + `Hours: Mon–Sat 09:00–18:00; Sunday closed\n`
    + `Core values: Government Approved; Authentic & Herbal; Community Trusted\n`
    + `Business modes: Wholesale & Retail available\n`
    + `Ordering: Use the Collection page to browse and add to cart\n`
    + `Appointments: Book doctor appointments online via the app\n`
    + `Support: Use the Support page (/support) for inquiries, tickets, or feedback; Contact page (/contact) shows email/phone/map\n`
    + `Payments: Cash on Delivery or bank slip (where applicable)\n`
    + `Shipping: Typically 3–5 business days within Sri Lanka\n`
    + `AI assistant: Provides quick help in English or Sinhala (Sinhala only when the user asks in Sinhala/Singlish)`;

  const vision = `Vision: Build a comprehensive Ayurvedic Medical Center web app that boosts operational efficiency for suppliers and admins, while giving customers an engaging experience with easy appointment booking, clear product info and pricing, personalized recommendations, and responsive support.`;

  const functionalities = [
    "Browse Ayurvedic products by category",
    "See detailed product info with transparent pricing",
    "Add to cart and checkout with COD or bank slip",
    "Book doctor appointments online",
    "Use the AI assistant for quick help (English or Sinhala)",
    "Get personalized product recommendations",
    "Create support tickets and send feedback",
    "Track orders and view receipts",
    "Access a responsive experience on mobile & desktop",
  ];

  const instructions = `You are Ayubo Lanka's helpful assistant. Answer concisely and accurately.
If the user asks about product price or details, use ONLY the product catalog below. If the product is not found, say you couldn't find it and suggest browsing the Collection page.
If the user asks about doctors, specialties, experience, consultation fees, availability, contact or booking, use ONLY the "Doctors" block below. If a doctor is not listed, say you couldn't find them and suggest visiting the Doctors page or asking for more details.
If the user asks about the store (Galgamu Stores), location, contact, opening hours, values, support page, appointment booking, wholesale/retail availability, the vision of Ayubo Lanka, or what users can do on the website (functionalities), use ONLY the "Ayubo Lanka info", "Vision", and "Functionalities" blocks as relevant.
Language behavior:
- Detect the user's input language. If the message is in Sinhala script or is Sinhala written with Latin letters ("Singlish"), reply in natural Sinhala (transliterate Singlish to Sinhala). Otherwise, reply strictly in the user's language. Do NOT switch to Sinhala unless the user used Sinhala or Singlish.
Keep answers brief unless the user asks for more details.`;

    // Build the content with systemInstruction + single user message containing the catalog context
  const userText = `Instructions:\n${instructions}\n\nAyubo Lanka info:\n${siteInfo}\n\n${vision}\n\nFunctionalities:\n- ${functionalities.join("\n- ")}\n\nDoctors (sample):\n${doctorLines.join("\n")}\n\nProduct catalog (sample):\n${catalogLines.join("\n")}\n\nUser message: ${message}`;

    // Discover a supported model dynamically
    let lastErrorBody = null;
    const { models: available, base } = await listModels(apiKey);
    const chosen = pickModel(available);
    if (chosen?.name) {
      const modelPath = chosen.name.startsWith("models/") ? chosen.name.replace(/^models\//, "") : chosen.name.split("/models/").pop();
      const url = `${base}/${modelPath}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userText }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          data?.candidates?.[0]?.content?.parts?.map((p) => p?.text).join("\n") ||
          "Sorry, I couldn't generate a response.";
        return res.json({ reply });
      } else {
        try {
          lastErrorBody = await resp.json();
        } catch (_) {
          lastErrorBody = { status: resp.status, text: await resp.text() };
        }
      }
    }

    // AI failed: provide a local lightweight fallback using product DB
    const msgStr = String(message || "");
    const q = msgStr.toLowerCase();
    const isSinhalaScript = /[\u0D80-\u0DFF]/.test(msgStr);
    const looksSinglish = (() => {
      const patterns = [
        "kohomada",
        "komada",
        "kawda",
        "meka",
        "oya",
        "mage",
        "karanna",
        "hadanna",
        "kauda",
        "kohom",
      ];
      return patterns.some((p) => q.includes(p));
    })();
    const wantSinhala = isSinhalaScript || looksSinglish;

    const qWords = q.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const matches = (products || []).filter((p) => {
      const n = String(p.name || "").toLowerCase();
      return qWords.some((w) => w.length > 2 && n.includes(w));
    });
    if (matches.length) {
      const top = matches.slice(0, 3).map((p) => {
        const price = typeof p.price === "number" ? p.price.toFixed(2) : p.price;
        const desc = (p.description || "").slice(0, 160);
        return `• ${p.name} — Rs. ${price}${desc ? ` — ${desc}` : ""}`;
      });
      const fallbackReply = wantSinhala
        ? `ඔබගේ ප්‍රශ්නයට AI පිළිතුර ලබා දීමට නොහැකි විය. එහෙත් අපගේ දත්තගබඩාව අනුව සම්බන්ධිත නිෂ්පාදන කිහිපයක් මෙන්න:\n${top.join("\n")}\nතවත් විස්තර සඳහා Collection පිටුව බලන්න හෝ Support මඟින් අපව සම්බන්ධ කරගන්න.`
        : `We couldn't get an AI answer right now. Here are a few related products from our database:\n${top.join("\n")}\nFor more details, please check the Collection page or contact us via Support.`;
      return res.json({ reply: fallbackReply, fallback: true, error: lastErrorBody });
    }

    const generic = wantSinhala
      ? `කණගාටුයි, මේ මොහොතේ AI පිළිතුරු ලබා දීමට නොහැක. කරුණාකර පසුව උත්සාහ කරන්න, නැතහොත් Support පිටුව හරහා අපව සම්බන්ධ කරගන්න.`
      : `Sorry, we couldn't provide an AI answer right now. Please try again later or reach us through the Support page.`;
    return res.json({ reply: generic, fallback: true, error: lastErrorBody });
  } catch (err) {
    console.error("askChat error:", err);
    return res.status(500).json({ message: "Server error", error: err?.message || String(err) });
  }
};

export default askChat;
