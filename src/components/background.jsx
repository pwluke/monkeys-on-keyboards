import React, { useState } from "react";

// Preload images
import bg1 from "@/assets/bg1.jpg";
import bg2 from "@/assets/bg2.jpg";

const backgrounds = [
  { label: "Solid White", type: "color", value: "#ffffffff" },
  { label: "Dark GRey", type: "color", value: "#292929ff" },
  { label: "Image 1", type: "image", value: bg1 },
  { label: "Image 2", type: "image", value: bg2 },
];

export default function BackgroundSwitcher({ children }) {
  const [selected, setSelected] = useState(backgrounds[0]);

  const style =
    selected.type === "color"
      ? { background: selected.value }
      : {
          background: `url(${selected.value}) center center / cover no-repeat`,
        };

  return (
    <div style={{ ...style, minHeight: "100vh", width: "100vw", transition: "background 0.3s" }}>
      <div
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 1001,
          background: "rgba(255,255,255,0.85)",
          borderRadius: "8px",
          padding: "8px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ marginRight: 8 }}>Background:</span>
        <select
          value={selected.label}
          onChange={e =>
            setSelected(backgrounds.find(bg => bg.label === e.target.value))
          }
        >
          {backgrounds.map(bg => (
            <option key={bg.label} value={bg.label}>
              {bg.label}
            </option>
          ))}
        </select>
      </div>
      {children}
    </div>
  );
}