"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { isArcticAtom, isTransparentAtom, isLineweightAtom, showLabelsAtom } from "@/lib/atoms";
import { Edges, Html } from "@react-three/drei";
import * as THREE from "three";

export default function ClickableObject({ 
  object, 
  isSelected, 
  onSelect, 
  objectRef 
}) {
  const meshRef = useRef();
  const { camera, raycaster, mouse } = useThree();
  const [isArctic] = useAtom(isArcticAtom);
  const [isTransparent] = useAtom(isTransparentAtom);
  const [isLineweight] = useAtom(isLineweightAtom);
  const [showLabels] = useAtom(showLabelsAtom);
  
  // Add outline effect for selected objects
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = isSelected ? new THREE.Color(0x222222) : new THREE.Color(0x000000);
        }
      });
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    console.log(`Clicked on ${object.type} with ID: ${object.id}`);
    onSelect();
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  };

  const renderShape = () => {
    const commonProps = {
      ref: meshRef,
      onClick: handleClick,
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
      castShadow: true,
      receiveShadow: true
    };

    // Define geometries and default colors
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

    if (!geometries[object.type]) {
      return null;
    }

    // Material system with embodied carbon
    let materialName = "Plastic";
    let embodiedCarbon = 5.0;
    let baseColor = colors[object.type] || "red";

    // Start with safe default material properties
    let materialProps = {
      color: baseColor,
      transparent: isTransparent || isLineweight,
      opacity: isTransparent ? 0.7 : isLineweight ? 0.1 : 1,
      wireframe: isLineweight,
      roughness: 0.5,
      metalness: 0
    };

    // Apply effect-based material properties first (before material-specific overrides)
    const effect = object.effect || "matte";
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
          opacity: isTransparent ? materialProps.opacity : 0.3, 
          transparent: true 
        };
        break;
      case "textured":
        // Placeholder: would need a texture map
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
          opacity: isTransparent ? materialProps.opacity : 0.7, 
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
    switch (object.material) {
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
        // Use object color if provided, otherwise preserve effect color or use shape default color
        if (!effectHasColor) {
          materialProps.color = object.color || baseColor;
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
      <mesh {...commonProps}>
        {geometries[object.type]}
        <meshStandardMaterial {...materialProps} />
        {isLineweight && <Edges />}
        {showLabels && (
          <>
        <Html
          position={[0, 1, 0]}
          center
          distanceFactor={10}
        >
          <div style={{
            color: (object.theme === "dark") ? "white" : "black",
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
            color: (object.theme === "dark") ? "white" : "black",
            fontSize: "10px",
            textAlign: "center",
            pointerEvents: "none",
            userSelect: "none"
          }}>
            {`Embodied Carbon: ${embodiedCarbon} kgCO₂e`}
          </div>
        </Html>
        </>
        )}
      </mesh>
    );
  };

  return (
    <group 
      ref={objectRef} 
      position={object.position || [0, 0, 0]} 
      rotation={object.rotation || [0, 0, 0]} 
      scale={object.scale || [1, 1, 1]}
    >
      {renderShape()}
    </group>
  );
}
