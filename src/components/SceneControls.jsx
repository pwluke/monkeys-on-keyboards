"use client";
import { useRef } from "react";

export default function SceneControls({ objects, onSceneLoad }) {
  const fileInputRef = useRef(null);

  const handleSaveScene = () => {
    const sceneData = JSON.stringify(objects, null, 2);
    const blob = new Blob([sceneData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scene.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadScene = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sceneData = JSON.parse(e.target.result);
        if (Array.isArray(sceneData)) {
          onSceneLoad(sceneData);
        } else {
          alert("Invalid scene file format.");
        }
      } catch (error) {
        console.error("Error loading scene:", error);
        alert("Failed to load scene file. Make sure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset file input to allow loading the same file again
    event.target.value = null;
  };

  const triggerFileLoad = () => {
    fileInputRef.current?.click();
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
        Scene Controls
      </h3>
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={handleSaveScene} style={{ flex: 1, padding: "6px 8px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "500" }}>
          💾 Save Scene
        </button>
        <button onClick={triggerFileLoad} style={{ flex: 1, padding: "6px 8px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "500" }}>
          📂 Load Scene
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLoadScene}
          accept=".json"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}