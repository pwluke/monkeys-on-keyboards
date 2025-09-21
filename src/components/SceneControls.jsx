"use client";
import { useRef, useState } from "react";

export default function SceneControls({ objects, onSceneLoad }) {
  const fileInputRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState("");

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

  const handlePresetLoad = async () => {
    if (!selectedPreset) return;
    
    try {
      const response = await fetch(`/${selectedPreset}`);
      if (!response.ok) {
        throw new Error(`Failed to load preset: ${response.statusText}`);
      }
      const sceneData = await response.json();
      if (Array.isArray(sceneData)) {
        onSceneLoad(sceneData);
      } else {
        alert("Invalid preset scene format.");
      }
    } catch (error) {
      console.error("Error loading preset scene:", error);
      alert("Failed to load preset scene.");
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
        Scene Controls
      </h3>
      
      {/* Preset Scene Selector */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "11px", fontWeight: "500", color: "#666", display: "block", marginBottom: "4px" }}>
          Load Preset Scene:
        </label>
        <div style={{ display: "flex", gap: "4px" }}>
          <select 
            value={selectedPreset} 
            onChange={(e) => setSelectedPreset(e.target.value)}
            style={{ 
              flex: 1, 
              padding: "4px 6px", 
              fontSize: "11px", 
              border: "1px solid #ddd", 
              borderRadius: "4px",
              background: "white"
            }}
          >
            <option value="">Select a preset...</option>
            <option value="tall_tower_scene.json">🏗️ Tall Tower</option>
            <option value="castle_scene_v3.json">🏰 Castle</option>
            <option value="circular_Castle_shapes.json">🐨 Circular Castle</option>
          </select>
          <button 
            onClick={handlePresetLoad} 
            disabled={!selectedPreset}
            style={{ 
              padding: "4px 8px", 
              background: selectedPreset ? "#6f42c1" : "#ccc", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: selectedPreset ? "pointer" : "not-allowed", 
              fontSize: "11px", 
              fontWeight: "500" 
            }}
          >
            Load
          </button>
        </div>
      </div>

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