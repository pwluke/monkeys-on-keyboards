
"use client";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes"; 
import { Grid, OrbitControls, Edges, Text } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MaterialSelector } from "@/components/MaterialSelector";
import { ViewSelector } from "@/components/ViewSelector";

function Shape({ type, position, view, theme, material }) {
  const isLineweight = view === "lineweight";
  const isArctic = view === "arctic";

  let materialProps = {
    color: isArctic ? "white" : undefined,
    transparent: view === "transparent" || isLineweight,
    opacity: view === "transparent" ? 0.7 : isLineweight ? 0.1 : 1,
  };

  const geometries = {
    box: <boxGeometry />,
    cone: <coneGeometry />,
    sphere: <sphereGeometry />,
    cylinder: <cylinderGeometry />,
    torus: <torusGeometry />,
  };

  const colors = {
    box: "red",
    cone: "blue",
    sphere: "green",
    cylinder: "yellow",
    torus: "purple",
  };

  if (!geometries[type]) {
    return null;
  }

  let materialName = "meshStandardMaterial";
  let embodiedCarbon = 0;
  switch (material) {
    case "wood":
      materialProps = { ...materialProps, color: "#8B4513", roughness: 0.8, metalness: 0 };
      materialName = "Wood";
      embodiedCarbon = 0.5;
      break;
    case "metal":
      materialProps = { ...materialProps, color: "#C0C0C0", roughness: 0.2, metalness: 1.0 };
      materialName = "Metal";
      embodiedCarbon = 8.0;
      break;
    case "bamboo":
      materialProps = { ...materialProps, color: "#A3A16B", roughness: 0.6, metalness: 0 };
      materialName = "Bamboo";
      embodiedCarbon = 0.6;
      break;
    default:
      // 'default' material uses the color from the colors map
      materialProps.color = isArctic ? "white" : colors[type];
      embodiedCarbon = 5.0; // Default for plastic
      break;
  }
  if (isArctic) {
    materialProps.color = "white";
  }

  return (
    <mesh position={position}>
      {geometries[type]}
      <meshStandardMaterial {...materialProps} />
      {isLineweight && <Edges />}
      <Text
        position={[0, 1, 0]}
        fontSize={0.25}
        color={theme === "dark" ? "white" : "black"}
        anchorX="center"
        anchorY="middle"
      >
        {materialName}
      </Text>
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.18}
        color={theme === "dark" ? "white" : "black"}
        anchorX="center"
        anchorY="middle"
      >
        {`Embodied Carbon: ${embodiedCarbon} kgCO₂e`}
      </Text>
    </mesh>
  );
}

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0], material: "default" },
  ]);
  const [view, setView] = useState("default");
  const { theme } = useTheme();
  const [material, setMaterial] = useState("default");
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => setMounted(true), []);

  const handleAddObject = (type) => {
    const position = [
      (Math.random() - 0.5) * 4,
      0.5,
      (Math.random() - 0.5) * 4,
    ];
    setObjects([...objects, { type, id: Date.now(), position, material }]);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleMaterialChange = (newMaterial) => {
    setMaterial(newMaterial);
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
        <MaterialSelector
          onMaterialChange={handleMaterialChange}
          currentMaterial={material}
        />
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
          <Shape
            key={obj.id}
            type={obj.type}
            position={obj.position}
            view={view}
            theme={theme}
            material={obj.material}
          />
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
