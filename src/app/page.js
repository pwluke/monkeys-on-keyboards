
"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import ColorPickerPanel from "@/components/ui/ColorPickerPanel";

function Shape({ type, position, color }) {
  switch (type) {
    case "box":
      return (
        <mesh position={position}>
          <boxGeometry />
          <meshStandardMaterial color={color || "red"} />
        </mesh>
      );
    case "cone":
      return (
        <mesh position={position}>
          <coneGeometry />
          <meshStandardMaterial color={color || "blue"} />
        </mesh>
      );
    case "sphere":
      return (
        <mesh position={position}>
          <sphereGeometry />
          <meshStandardMaterial color={color || "green"} />
        </mesh>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0], color: "#ff0000" },
  ]);

  const handleAddObject = (type) => {
    const position = [
      (Math.random() - 0.5) * 4,
      0.5,
      (Math.random() - 0.5) * 4,
    ];
    let color = "#ff0000";
    if (type === "cone") color = "#0000ff";
    if (type === "sphere") color = "#00ff00";
    setObjects([...objects, { type, id: Date.now(), position, color }]);
  };

  const handleColorChange = (id, newColor) => {
    setObjects(objects.map(obj => obj.id === id ? { ...obj, color: newColor } : obj));
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
        <ObjectSelector onObjectSelect={handleAddObject} />
        <ColorPickerPanel objects={objects} onColorChange={handleColorChange} />
      </div>
      <Canvas>
        <ambientLight intensity={2.5} />
        <directionalLight position={[1, 1, 1]} />
        {objects.map((obj) => (
          <Shape key={obj.id} type={obj.type} position={obj.position} color={obj.color} />
        ))}
        <Grid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
