import { useRef } from "react";
import { useAtom } from "jotai";
import { Edges, Html } from "@react-three/drei";
import { pickedColorAtom, currentViewAtom, isArcticAtom, isTransparentAtom, isLineweightAtom } from "@/lib/atoms";

export default function Shape({ type, position, view, theme, material, effect = "matte" }) {
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

  // Apply effect-based material properties first
  switch (effect) {
    case "metallic":
      materialProps = { ...materialProps, metalness: 1, roughness: 0.2 };
      break;
    case "matte":
      materialProps = { ...materialProps, metalness: 0, roughness: 1 };
      break;
    case "reflective":
      materialProps = { ...materialProps, metalness: 1, roughness: 0, envMapIntensity: 2 };
      break;
    case "glossy":
      materialProps = { ...materialProps, metalness: 0.8, roughness: 0.1 };
      break;
    case "glass":
      materialProps = { 
        ...materialProps, 
        metalness: 0.25, 
        roughness: 0, 
        opacity: view === "transparent" ? materialProps.opacity : 0.3, 
        transparent: true 
      };
      break;
    case "textured":
      materialProps = { ...materialProps, metalness: 0.2, roughness: 0.7 };
      break;
    case "emissive":
      materialProps = { 
        ...materialProps, 
        metalness: 0.1, 
        roughness: 0.5, 
        emissive: "yellow", 
        emissiveIntensity: 1 
      };
      break;
    case "toon":
      materialProps = { ...materialProps, metalness: 0, roughness: 0.8 };
      break;
    case "wireframe":
      materialProps = { ...materialProps, metalness: 0, roughness: 0.5, wireframe: true };
      break;
    case "bumpy":
      materialProps = { ...materialProps, metalness: 0.3, roughness: 0.7 };
      break;
    case "fresnel":
      materialProps = { ...materialProps, metalness: 0.2, roughness: 0.5 };
      break;
    case "holographic":
      materialProps = { 
        ...materialProps, 
        metalness: 1, 
        roughness: 0, 
        envMapIntensity: 2, 
        opacity: view === "transparent" ? materialProps.opacity : 0.7, 
        transparent: true, 
        color: "#00ffff" 
      };
      break;
    case "concrete":
      materialProps = { ...materialProps, metalness: 0, roughness: 1, color: "#888" };
      break;
    default:
      // Keep default properties
      break;
  }

  // Apply material-specific properties (preserving effect-based color if it was set)
  const effectHasColor = effect === "holographic" || effect === "concrete";
  switch (material) {
    case "wood":
      if (!effectHasColor) materialProps.color = "#8B4513";
      materialProps.roughness = Math.max(materialProps.roughness, 0.6); // Don't make wood too shiny
      if (effect === "matte") materialProps.metalness = 0; // Wood should never be metallic unless effect overrides
      materialName = "Wood";
      embodiedCarbon = 0.5;
      break;
    case "metal":
      if (!effectHasColor) materialProps.color = "#C0C0C0";
      // Metal materials work well with metallic effects, so preserve effect properties
      materialName = "Metal";
      embodiedCarbon = 8.0;
      break;
    case "bamboo":
      if (!effectHasColor) materialProps.color = "#A3A16B";
      materialProps.roughness = Math.max(materialProps.roughness, 0.5); // Bamboo has some natural roughness
      if (effect === "matte") materialProps.metalness = 0; // Bamboo should never be metallic unless effect overrides
      materialName = "Bamboo";
      embodiedCarbon = 0.6;
      break;
    default:
      // Use shape default color if no effect color was set
      if (!effectHasColor) {
        materialProps.color = baseColor;
      }
      embodiedCarbon = 5.0; // Default for plastic
      break;
  }

  // Handle wireframe from both lineweight view and wireframe effect
  if (isLineweight || effect === "wireframe") {
    materialProps.wireframe = true;
    if (isLineweight) {
      materialProps.transparent = true;
      materialProps.opacity = 0.1;
    }
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