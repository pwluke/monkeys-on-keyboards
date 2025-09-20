"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ClickableObject({ 
  object, 
  isSelected, 
  onSelect, 
  objectRef 
}) {
  const meshRef = useRef();
  const { camera, raycaster, mouse } = useThree();
  
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

    switch (object.type) {
      case "box":
        return (
          <mesh {...commonProps}>
            <boxGeometry />
            <meshStandardMaterial 
              color={object.color || "red"} 
              transparent={false}
              opacity={1}
            />
          </mesh>
        );
      case "cone":
        return (
          <mesh {...commonProps}>
            <coneGeometry />
            <meshStandardMaterial 
              color={object.color || "blue"} 
              transparent={false}
              opacity={1}
            />
          </mesh>
        );
      case "sphere":
        return (
          <mesh {...commonProps}>
            <sphereGeometry />
            <meshStandardMaterial 
              color={object.color || "green"} 
              transparent={false}
              opacity={1}
            />
          </mesh>
        );
      default:
        return null;
    }
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
