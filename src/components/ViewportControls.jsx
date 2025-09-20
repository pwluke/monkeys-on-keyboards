"use client";
import { useState } from "react";

export const VIEW_PRESETS = {
  "Perspective": {
    position: [5, 5, 5],
    target: [0, 0, 0],
    type: "perspective"
  },
  "Top": {
    position: [0, 10, 0],
    target: [0, 0, 0],
    type: "orthographic"
  },
  "Bottom": {
    position: [0, -10, 0],
    target: [0, 0, 0],
    type: "orthographic"
  },
  "Front": {
    position: [0, 0, 10],
    target: [0, 0, 0],
    type: "orthographic"
  },
  "Back": {
    position: [0, 0, -10],
    target: [0, 0, 0],
    type: "orthographic"
  },
  "Left": {
    position: [-10, 0, 0],
    target: [0, 0, 0],
    type: "orthographic"
  },
  "Right": {
    position: [10, 0, 0],
    target: [0, 0, 0],
    type: "orthographic"
  },
  "Isometric": {
    position: [8, 8, 8],
    target: [0, 0, 0],
    type: "perspective"
  }
};

export default function ViewportControls({ activeView, onViewChange, isAnimating }) {

  const changeView = (viewName) => {
    if (isAnimating || viewName === activeView) return;
    
    const view = VIEW_PRESETS[viewName];
    if (!view) return;
    
    onViewChange?.(viewName, view);
  };

  const getViewIcon = (viewName) => {
    switch (viewName) {
      case "Perspective": return "🎥";
      case "Top": return "⬆️";
      case "Bottom": return "⬇️";
      case "Front": return "👁️";
      case "Back": return "👁️‍🗨️";
      case "Left": return "⬅️";
      case "Right": return "➡️";
      case "Isometric": return "📐";
      default: return "🎥";
    }
  };

  return (
    <div style={{ 
      padding: "12px", 
      background: "white", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
        Viewport Controls
      </h3>
      
      {/* View Buttons Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)", 
        gap: "6px",
        marginBottom: "12px"
      }}>
        {Object.keys(VIEW_PRESETS).map((viewName) => (
          <button
            key={viewName}
            onClick={() => changeView(viewName)}
            disabled={isAnimating}
            style={{
              padding: "8px 6px",
              background: activeView === viewName ? "#007bff" : "#f8f9fa",
              color: activeView === viewName ? "white" : "black",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: isAnimating ? "not-allowed" : "pointer",
              fontSize: "11px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              opacity: isAnimating ? 0.6 : 1,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (!isAnimating && activeView !== viewName) {
                e.target.style.background = "#e9ecef";
              }
            }}
            onMouseLeave={(e) => {
              if (!isAnimating && activeView !== viewName) {
                e.target.style.background = "#f8f9fa";
              }
            }}
          >
            <span style={{ fontSize: "14px" }}>{getViewIcon(viewName)}</span>
            <span>{viewName}</span>
          </button>
        ))}
      </div>

      {/* Current View Info */}
      <div style={{ 
        padding: "8px", 
        background: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "11px",
        color: "#666"
      }}>
        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
          Current: {activeView}
        </div>
        <div style={{ fontSize: "10px" }}>
          {isAnimating ? "Animating..." : "Ready"}
        </div>
      </div>

      {/* Instructions */}
      <p style={{ 
        margin: "12px 0 0 0", 
        fontSize: "11px", 
        color: "#666",
        lineHeight: "1.4"
      }}>
        Click any view button to smoothly transition the camera. 
        Use mouse to orbit around the scene.
      </p>
    </div>
  );
}
