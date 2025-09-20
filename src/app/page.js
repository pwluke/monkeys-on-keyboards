
"use client";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { Grid, OrbitControls, Edges } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ViewSelector } from "@/components/ViewSelector";

function Shape({ type, position, view }) {
  const isLineweight = view === "lineweight";
  const isArctic = view === "arctic";

  const materialProps = {
    color: isArctic ? "white" : undefined,
    transparent: view === "transparent" || isLineweight,
    opacity: view === "transparent" ? 0.7 : isLineweight ? 0.1 : 1,
  };

  switch (type) {
    case "box":
      return (
        <mesh position={position}>
          <boxGeometry />
          <meshStandardMaterial color="red" {...materialProps} />
          {isLineweight && <Edges />}
        </mesh>
      );
    case "cone":
      return (
        <mesh position={position}>
          <coneGeometry />
          <meshStandardMaterial color="blue" {...materialProps} />
          {isLineweight && <Edges />}
        </mesh>
      );
    case "sphere":
      return (
        <mesh position={position}>
          <sphereGeometry />
          <meshStandardMaterial color="green" {...materialProps} />
          {isLineweight && <Edges />}
        </mesh>
      );    
    case "cylinder":
      return (
        <mesh position={position}>
          <cylinderGeometry />
          <meshStandardMaterial color="yellow" {...materialProps} />
          {isLineweight && <Edges />}
        </mesh>
      );
    case "torus":
      return (
        <mesh position={position}>
          <torusGeometry />
          <meshStandardMaterial color="purple" {...materialProps} />
          {isLineweight && <Edges />}
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
  const [view, setView] = useState("default");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => setMounted(true), []);

  const handleAddObject = (type) => {
    const position = [
      (Math.random() - 0.5) * 4,
      0.5,
      (Math.random() - 0.5) * 4,
    ];
    setObjects([...objects, { type, id: Date.now(), position }]);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          display: "flex",
          gap: "10px",
        }}
      >
        <ObjectSelector onObjectSelect={handleAddObject} />
        <ViewSelector onViewChange={handleViewChange} currentView={view} />
        <ThemeToggle />
      </div>
      <Canvas
        shadows={view === "arctic"}
        camera={{ position: [-5, 5, 5], fov: 50 }}
      >
        <ambientLight intensity={view === "arctic" ? 4 : 2.5} />
        <directionalLight position={[1, 1, 1]} castShadow={view === "arctic"} />
        {mounted && (
          <color attach="background" args={[theme === "dark" ? "#141414" : "#f0f0f0"]} />
        )}
        {objects.map((obj) => (
          <Shape key={obj.id} type={obj.type} position={obj.position} view={view} />
        ))}
        <Grid
          sectionSize={1}
          sectionColor={"#666666"}
          sectionThickness={1.5}
        />
        <OrbitControls />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}
