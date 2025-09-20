import { useRef } from "react";
import { useAtom } from "jotai";
import { Edges, Html } from "@react-three/drei";
import { pickedColorAtom, currentViewAtom, isArcticAtom, isTransparentAtom, isLineweightAtom } from "@/lib/atoms";

export default function Shape({ type, position, view, theme, material }) {
  const isLineweight = view === "lineweight";
  const isArctic = view === "arctic";

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

  let materialName = "Plastic";
  let embodiedCarbon = 5.0;
  let baseColor = colors[type] || "red";

  // Start with safe default material properties
  let materialProps = {
    color: baseColor,
    transparent: view === "transparent" || isLineweight,
    opacity: view === "transparent" ? 0.7 : isLineweight ? 0.1 : 1,
    roughness: 0.5,
    metalness: 0
  };

  // Apply material-specific properties
  switch (material) {
    case "wood":
      materialProps.color = "#8B4513";
      materialProps.roughness = 0.8;
      materialProps.metalness = 0;
      materialName = "Wood";
      embodiedCarbon = 0.5;
      break;
    case "metal":
      materialProps.color = "#C0C0C0";
      materialProps.roughness = 0.2;
      materialProps.metalness = 1.0;
      materialName = "Metal";
      embodiedCarbon = 8.0;
      break;
    case "bamboo":
      materialProps.color = "#A3A16B";
      materialProps.roughness = 0.6;
      materialProps.metalness = 0;
      materialName = "Bamboo";
      embodiedCarbon = 0.6;
      break;
    default:
      // Use shape default color
      materialProps.color = baseColor;
      embodiedCarbon = 5.0; // Default for plastic
      break;
  }

  // Arctic view overrides all colors
  if (isArctic) {
    materialProps.color = "white";
  }

  return (
    <mesh position={position}>
      {geometries[type]}
      <meshStandardMaterial {...materialProps} />
      {isLineweight && <Edges />}
      <Html
        position={[0, 1, 0]}
        center
        distanceFactor={10}
      >
        <div style={{
          color: theme === "dark" ? "white" : "black",
          fontSize: "12px",
          fontWeight: "bold",
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none"
        }}>
          {materialName}
        </div>
      </Html>
      <Html
        position={[0, 0.7, 0]}
        center
        distanceFactor={10}
      >
        <div style={{
          color: theme === "dark" ? "white" : "black",
          fontSize: "10px",
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none"
        }}>
          {`Embodied Carbon: ${embodiedCarbon} kgCO₂e`}
        </div>
      </Html>
    </mesh>
  );
}