
"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";

function Shape({ type, position }) {
  switch (type) {
    case "box":
      return (
        <mesh position={position}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      );
    case "cone":
      return (
        <mesh position={position}>
          <coneGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>
      );
    case "sphere":
      return (
        <mesh position={position}>
          <sphereGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0] },
  ]);

  const handleAddObject = (type) => {
    const position = [
      (Math.random() - 0.5) * 4,
      0.5,
      (Math.random() - 0.5) * 4,
    ];
    setObjects([...objects, { type, id: Date.now(), position }]);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
        <ObjectSelector onObjectSelect={handleAddObject} />
      </div>
      <Canvas>
        <ambientLight intensity={2.5} />
        <directionalLight position={[1, 1, 1]} />
        {objects.map((obj) => (
          <Shape key={obj.id} type={obj.type} position={obj.position} />
        ))}
        <Grid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
