import React from "react";

export default function Counter({ items }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: "rgba(255,255,255,0.9)",
        padding: "8px 16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      Items in scene: <strong>{items ? items.length : 0}</strong>
    </div>
  );
}