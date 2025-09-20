import React from "react";

/**
 * BoundingBox component
 * @param {Array} items - Array of objects with { x, y, z } properties
 */
export default function BoundingBox({ items = [] }) {
  if (!items.length) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "rgba(240,240,255,0.95)",
          padding: "12px 20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          zIndex: 1000,
        }}
      >
        No items in scene.
      </div>
    );
  }

  // Calculate min/max for each axis
  const xs = items.map(item => item.x);
  const ys = items.map(item => item.y);
  const zs = items.map(item => item.z);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        background: "rgba(240,240,255,0.95)",
        padding: "12px 20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}
    >
      <div><strong>Bounding Box Dimensions</strong></div>
      <div>Width: {width.toFixed(2)}</div>
      <div>Height: {height.toFixed(2)}</div>
      <div>Depth: {depth.toFixed(2)}</div>
    </div>
  );
}