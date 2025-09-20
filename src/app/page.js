"use client";
import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Environment } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import EffectSelector from "@/components/ui/EffectSelector";
import ColorPickerPanel from "@/components/ui/ColorPickerPanel";

import ArtPiece from "@/components/ArtPiece";

function Shape({ type, position, color, effect }) {
  // Compute effect-driven material settings
  let materialProps = {};
  switch (effect) {
    case "metallic":
      materialProps = { metalness: 1, roughness: 0.2 };
      break;
    case "matte":
      materialProps = { metalness: 0, roughness: 1 };
      break;
    case "reflective":
      materialProps = { metalness: 1, roughness: 0, envMapIntensity: 2 };
      break;
    case "glossy":
      materialProps = { metalness: 0.8, roughness: 0.1 };
      break;
    case "glass":
      materialProps = { metalness: 0.25, roughness: 0, opacity: 0.3, transparent: true };
      break;
    case "textured":
      // Placeholder for a real texture: add map/normalMap here when available
      materialProps = { metalness: 0.2, roughness: 0.7 };
      break;
    case "emissive":
      materialProps = { metalness: 0.1, roughness: 0.5, emissive: "yellow", emissiveIntensity: 1 };
      break;
    case "toon":
      // Would swap to MeshToonMaterial for a true toon effect
      materialProps = { metalness: 0, roughness: 0.8 };
      break;
    case "wireframe":
      materialProps = { metalness: 0, roughness: 0.5, wireframe: true };
      break;
    case "bumpy":
      // Would attach a normalMap for real bumpiness
      materialProps = { metalness: 0.3, roughness: 0.7 };
      break;
    case "fresnel":
      // True fresnel would need a custom shader
      materialProps = { metalness: 0.2, roughness: 0.5 };
      break;
    case "holographic":
      materialProps = { metalness: 1, roughness: 0, envMapIntensity: 2, opacity: 0.7, transparent: true, color: "#00ffff" };
      break;
    case "concrete":
      materialProps = { metalness: 0, roughness: 1, color: "#888" };
      break;
    default:
      materialProps = { metalness: 0, roughness: 0.5 };
  }

  const meshRef = useRef();

  // Default color per shape if none provided
  const defaultColorByType = { box: "red", cone: "blue", sphere: "green" };
  const finalColor = color || defaultColorByType[type] || "white";

  switch (type) {
    case "box":
      return (
        <mesh ref={meshRef} position={position}>
          <boxGeometry />
          <meshStandardMaterial color={finalColor} {...materialProps} />
        </mesh>
      );
    case "cone":
      return (
        <mesh ref={meshRef} position={position}>
          <coneGeometry />
          <meshStandardMaterial color={finalColor} {...materialProps} />
        </mesh>
      );
    case "sphere":
      return (
        <mesh ref={meshRef} position={position}>
          <sphereGeometry />
          <meshStandardMaterial color={finalColor} {...materialProps} />
        </mesh>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0], color: "#ff0000", effect: "matte" },
  ]);

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

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1, display: "grid", gap: 12 }}>
        <ObjectSelector onObjectSelect={handleAddObject} />
        <ColorPickerPanel objects={objects} onColorChange={handleColorChange} />
        <EffectSelector objects={objects} onEffectChange={handleEffectChange} />
      </div>

      <Canvas>
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
          />
        ))}
        <Grid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

