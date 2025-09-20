"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { isArcticAtom, isTransparentAtom, isLineweightAtom } from "@/lib/atoms";
import { Edges } from "@react-three/drei";
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

    // Apply view overrides for material properties
    const materialProps = {
      color: isArctic ? "white" : (object.color || "red"),
      transparent: isTransparent || isLineweight,
      opacity: isTransparent ? 0.7 : isLineweight ? 0.1 : 1,
      wireframe: isLineweight
    };

    const defaultColors = { box: "red", cone: "blue", sphere: "green" };

    switch (object.type) {
      case "box":
        return (
          <mesh {...commonProps}>
            <boxGeometry />
            <meshStandardMaterial 
              {...materialProps}
              color={isArctic ? "white" : (object.color || defaultColors.box)}
            />
            {isLineweight && <Edges />}
          </mesh>
        );
      case "cone":
        return (
          <mesh {...commonProps}>
            <coneGeometry />
            <meshStandardMaterial 
              {...materialProps}
              color={isArctic ? "white" : (object.color || defaultColors.cone)}
            />
            {isLineweight && <Edges />}
          </mesh>
        );
      case "sphere":
        return (
          <mesh {...commonProps}>
            <sphereGeometry />
            <meshStandardMaterial 
              {...materialProps}
              color={isArctic ? "white" : (object.color || defaultColors.sphere)}
            />
            {isLineweight && <Edges />}
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
