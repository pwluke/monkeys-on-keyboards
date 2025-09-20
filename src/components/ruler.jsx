import React, { useState } from "react";

/**
 * Ruler component: Click twice on the screen to measure distance between two points.
 */
function RulerOverlay({ getSceneCoords }) {
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(null);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scenePoint = getSceneCoords ? getSceneCoords(x, y) : { x, y };

    if (points.length === 0) {
      setPoints([scenePoint]);
      setDistance(null);
    } else if (points.length === 1) {
      setPoints([points[0], scenePoint]);
      const dx = scenePoint.x - points[0].x;
      const dy = scenePoint.y - points[0].y;
      setDistance(Math.sqrt(dx * dx + dy * dy));
    } else {
      setPoints([scenePoint]);
      setDistance(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          cursor: "crosshair",
          pointerEvents: "auto",
        }}
        onClick={handleClick}
        title="Click twice to measure"
      />
      {points.map((pt, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: pt.x - 5,
            top: pt.y - 5,
            width: 10,
            height: 10,
            background: "blue",
            borderRadius: "50%",
            border: "2px solid white",
            zIndex: 2001,
            pointerEvents: "none",
          }}
        />
      ))}
      {points.length === 2 && (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 2001,
          }}
        >
          <line
            x1={points[0].x}
            y1={points[0].y}
            x2={points[1].x}
            y2={points[1].y}
            stroke="red"
            strokeWidth="2"
          />
        </svg>
      )}
      {distance !== null && (
        <div
          style={{
            position: "fixed",
            left:
              Math.min(points[0].x, points[1].x) +
              Math.abs(points[1].x - points[0].x) / 2,
            top:
              Math.min(points[0].y, points[1].y) +
              Math.abs(points[1].y - points[0].y) / 2 -
              30,
            background: "rgba(255,255,255,0.95)",
            padding: "6px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            zIndex: 2002,
            pointerEvents: "none",
            fontWeight: "bold",
          }}
        >
          {distance.toFixed(2)} px
        </div>
      )}
    </div>
  );
}

export default function Ruler({ getSceneCoords }) {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 2100,
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          background: active ? "#e53e3e" : "#3182ce",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
        onClick={() => setActive((a) => !a)}
      >
        {active ? "Disable Ruler" : "Enable Ruler"}
      </button>
      {active && <RulerOverlay getSceneCoords={getSceneCoords} />}
    </>
  );
}