"use client";
import { useState } from "react";

export default function ObjectSelectionPanel({ 
  objects, 
  selectedId, 
  onSelect, 
  onDelete, 
  onDuplicate 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredObjects = objects.filter(obj => 
    obj.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getObjectIcon = (type) => {
    switch (type) {
      case "box":
        return "📦";
      case "cone":
        return "🔺";
      case "sphere":
        return "⚪";
      default:
        return "📦";
    }
  };

  const getObjectColor = (color) => {
    return color || "#ff0000";
  };

  return (
    <div style={{ 
      padding: "12px", 
      background: "white", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0",
      minWidth: "250px"
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
        Object Selection ({objects.length})
      </h3>
      
      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search objects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "12px",
          marginBottom: "12px"
        }}
      />

      {/* Object List */}
      <div style={{ 
        maxHeight: "200px", 
        overflowY: "auto",
        border: "1px solid #f0f0f0",
        borderRadius: "4px"
      }}>
        {filteredObjects.length === 0 ? (
          <div style={{ 
            padding: "12px", 
            textAlign: "center", 
            color: "#999", 
            fontSize: "12px" 
          }}>
            {searchTerm ? "No objects found" : "No objects created"}
          </div>
        ) : (
          filteredObjects.map((obj) => (
            <div
              key={obj.id}
              onClick={() => onSelect(obj.id)}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
                backgroundColor: selectedId === obj.id ? "#e3f2fd" : "transparent",
                borderLeft: selectedId === obj.id ? "3px solid #2196f3" : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (selectedId !== obj.id) {
                  e.target.style.backgroundColor = "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== obj.id) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "16px" }}>{getObjectIcon(obj.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "500", color: "#333" }}>
                  {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}
                </div>
                <div style={{ 
                  fontSize: "11px", 
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <div 
                    style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "2px", 
                      backgroundColor: getObjectColor(obj.color),
                      border: "1px solid #ccc"
                    }}
                  />
                  <span>
                    Pos: [{obj.position?.map(p => p.toFixed(1)).join(", ")}]
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(obj.id);
                  }}
                  style={{
                    padding: "2px 6px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px"
                  }}
                  title="Duplicate"
                >
                  📋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(obj.id);
                  }}
                  style={{
                    padding: "2px 6px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px"
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <p style={{ 
        margin: "12px 0 0 0", 
        fontSize: "11px", 
        color: "#666",
        lineHeight: "1.4"
      }}>
        Click on objects in the list or in the 3D view to select them. 
        Selected objects can be transformed using the gizmo controls.
      </p>
    </div>
  );
}
