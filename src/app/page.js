"use client";
import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Environment } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import EffectSelector from "@/components/ui/EffectSelector";
import ColorPickerPanel from "@/components/ui/ColorPickerPanel";

import ArtPiece from "@/components/ArtPiece";
import Shape from "@/components/shape";
import CubeInstances from "@/components/matrix";
import MatrixInput from "@/components/MatrixInput";
import MaterialPicker from "@/components/mv";

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0], color: "#ff0000", effect: "matte" },
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  const handleAddObject = (type) => {
    const position = [(Math.random() - 0.5) * 4, 0.5, (Math.random() - 0.5) * 4];

    // reasonable defaults
    let color = "#ff0000";
    if (type === "cone") color = "#0000ff";
    if (type === "sphere") color = "#00ff00";

    setObjects((prev) => [
      ...prev,
      { type, id: Date.now(), position, color, effect: "matte" },
    ]);
  };

  const handleColorChange = (id, newColor) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, color: newColor } : obj)));
  };

  const handleEffectChange = (id, newEffect) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, effect: newEffect } : obj)));
  };

  const handleObjectClick = (id) => {
    setSelectedObjectId(id);
  };

  const handleDeselect = () => {
    setSelectedObjectId(null);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1, display: "grid", gap: 12 }}>
        <ObjectSelector onObjectSelect={handleAddObject} />
        <ColorPickerPanel objects={objects} onColorChange={handleColorChange} />
        <EffectSelector objects={objects} onEffectChange={handleEffectChange} />
        <MaterialPicker />
        <MatrixInput />
      </div>

      <Canvas onClick={handleDeselect}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} />
        <ArtPiece />
        {objects.map((obj) => (
          <Shape
            key={obj.id}
            type={obj.type}
            position={obj.position}
            color={obj.color}
            effect={obj.effect}
            isSelected={obj.id === selectedObjectId}
            onClick={() => handleObjectClick(obj.id)}
          />
        ))}
        <Grid />
        <CubeInstances />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
