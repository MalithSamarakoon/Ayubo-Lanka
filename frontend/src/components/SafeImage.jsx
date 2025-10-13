// src/components/SafeImage.jsx
import React, { useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='100%' height='100%' fill='#e2f6ee'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Inter, Arial' font-size='18' fill='#047857'>
        Image not available
      </text>
    </svg>`
  );

export default function SafeImage({ src, alt, className, onClick }) {
  const [err, setErr] = useState(false);

  // If you're using Vite + /public, use absolute paths like /images/xxx.jpg
  // If you're importing from /src/assets, import the file and pass the imported URL.
  const finalSrc = err || !src ? PLACEHOLDER : src;

  return (
    <img
      loading="lazy"
      src={finalSrc}
      alt={alt || "image"}
      className={className}
      onError={() => setErr(true)}
      onClick={onClick}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}
