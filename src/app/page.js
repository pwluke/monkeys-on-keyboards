
"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import EffectSelector from "@/components/ui/EffectSelector";

function Shape({ type, position, effect }) {
  // Effect-based material properties
  let materialProps = {};
  const meshRef = useRef();
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
      // Placeholder: would need a texture map
      materialProps = { metalness: 0.2, roughness: 0.7 }; // Add map prop for real texture
      break;
    case "emissive":
      materialProps = { metalness: 0.1, roughness: 0.5, emissive: "yellow", emissiveIntensity: 1 };
      break;
    case "toon":
      materialProps = { metalness: 0, roughness: 0.8 }; // Would use MeshToonMaterial for real toon
      break;
    case "wireframe":
      materialProps = { metalness: 0, roughness: 0.5, wireframe: true };
      break;
    case "bumpy":
      materialProps = { metalness: 0.3, roughness: 0.7 }; // Would use normalMap for real bumps
      break;
    case "fresnel":
      materialProps = { metalness: 0.2, roughness: 0.5 }; // Would need custom shader for real fresnel
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
  switch (type) {
    case "box":
      return (
        <mesh ref={meshRef} position={position}>
          <boxGeometry />
          <meshStandardMaterial color="red" {...materialProps} />
        </mesh>
      );
    case "cone":
      return (
        <mesh ref={meshRef} position={position}>
          <coneGeometry />
          <meshStandardMaterial color="blue" {...materialProps} />
        </mesh>
      );
    case "sphere":
      return (
        <mesh ref={meshRef} position={position}>
          <sphereGeometry />
          <meshStandardMaterial color="green" {...materialProps} />
        </mesh>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0], effect: "matte" },
  ]);

  const handleAddObject = (type) => {
    const position = [
      (Math.random() - 0.5) * 4,
      0.5,
      (Math.random() - 0.5) * 4,
    ];
    setObjects([...objects, { type, id: Date.now(), position, effect: "matte" }]);
  };

  const handleEffectChange = (id, newEffect) => {
    setObjects(objects.map(obj => obj.id === id ? { ...obj, effect: newEffect } : obj));
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
        <ObjectSelector onObjectSelect={handleAddObject} />
        <EffectSelector objects={objects} onEffectChange={handleEffectChange} />
      </div>
      <Canvas>
        <ambientLight intensity={2.5} />
        <directionalLight position={[1, 1, 1]} />
        {objects.map((obj) => (
          <Shape key={obj.id} type={obj.type} position={obj.position} effect={obj.effect} />
        ))}
        <Grid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
