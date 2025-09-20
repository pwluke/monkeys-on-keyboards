"use client";
import { useState } from "react";

export default function TransformUI({ 
  selectedObject, 
  transformMode, 
  onModeChange, 
  onDelete, 
  onDuplicate 
}) {
  if (!selectedObject) {
    return (
      <div style={{ 
        padding: "12px", 
        background: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
          No object selected
        </h3>
        <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
          Click on an object to select it
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "12px", 
      background: "white", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
        Transform Controls
      </h3>
      
      {/* Transform Mode Buttons */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        <button 
          onClick={() => onModeChange("translate")}
          style={{ 
            padding: "6px 12px", 
            background: transformMode === "translate" ? "#007bff" : "#f8f9fa",
            color: transformMode === "translate" ? "white" : "black",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          Move (G)
        </button>
        <button 
          onClick={() => onModeChange("rotate")}
          style={{ 
            padding: "6px 12px", 
            background: transformMode === "rotate" ? "#007bff" : "#f8f9fa",
            color: transformMode === "rotate" ? "white" : "black",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          Rotate (R)
        </button>
        <button 
          onClick={() => onModeChange("scale")}
          style={{ 
            padding: "6px 12px", 
            background: transformMode === "scale" ? "#007bff" : "#f8f9fa",
            color: transformMode === "scale" ? "white" : "black",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          Scale (S)
        </button>
      </div>

      {/* Object Info */}
      <div style={{ marginBottom: "12px" }}>
        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666" }}>
          Selected: <strong>{selectedObject.type}</strong>
        </p>
        <p style={{ margin: "0", fontSize: "11px", color: "#999" }}>
          Position: [{selectedObject.position?.map(p => p.toFixed(2)).join(", ")}]
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "6px" }}>
        <button 
          onClick={onDuplicate}
          style={{ 
            padding: "6px 12px", 
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          Duplicate
        </button>
        <button 
          onClick={onDelete}
          style={{ 
            padding: "6px 12px", 
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          Delete
        </button>
      </div>

      {/* Instructions */}
      <p style={{ 
        margin: "12px 0 0 0", 
        fontSize: "11px", 
        color: "#666",
        lineHeight: "1.4"
      }}>
        Click and drag the gizmo handles to transform the object. 
        Use keyboard shortcuts G/R/S to switch modes.
      </p>
    </div>
  );
}
