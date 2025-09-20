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

    // Apply material-specific properties
    switch (object.material) {
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
        // Use object color if provided, otherwise use shape default color
        materialProps.color = object.color || baseColor;
        embodiedCarbon = 5.0; // Default for plastic
        break;
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
