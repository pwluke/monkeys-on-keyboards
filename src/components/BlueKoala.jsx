import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { pickedColorAtom } from "@/lib/atoms";

// Koala component for R3F
const Koala = ({ position, rotation, scale, shape }) => {
  const koalaMaterial = { color: '#4169E1' };
  const eyeMaterial = { color: '#000000' };

  const BodyGeometry = () => {
    if (shape === 'box') {
      return <boxGeometry args={[0.18, 0.18, 0.18]} />;
    } else if (shape === 'cone') {
      return <coneGeometry args={[0.13, 0.22, 8]} />;
    } else {
      return <sphereGeometry args={[0.15, 8, 6]} />;
    }
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Body */}
      <mesh>
        <BodyGeometry />
        <meshLambertMaterial {...koalaMaterial} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshLambertMaterial {...koalaMaterial} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.07, 0.25, 0.05]}>
        <sphereGeometry args={[0.04, 6, 4]} />
        <meshLambertMaterial {...koalaMaterial} />
      </mesh>
      <mesh position={[0.07, 0.25, 0.05]}>
        <sphereGeometry args={[0.04, 6, 4]} />
        <meshLambertMaterial {...koalaMaterial} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.03, 0.22, 0.08]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial {...eyeMaterial} />
      </mesh>
      <mesh position={[0.03, 0.22, 0.08]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial {...eyeMaterial} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.2, 0.09]}>
        <sphereGeometry args={[0.008, 4, 4]} />
        <meshBasicMaterial {...eyeMaterial} />
      </mesh>
    </group>
  );
};

// Guggenheim structure component
export default function GuggenheimStructure({ isRotating, shape }) {
  const groupRef = useRef();

  useFrame(() => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const koalas = useMemo(() => {
    const koalaArray = [];
    
    // Create spiral levels
    for (let level = 0; level < 8; level++) {
      const radius = 3 - (level * 0.2);
      const height = level * 0.8;
      const koalasInLevel = Math.max(12 - level, 6);
      
      for (let i = 0; i < koalasInLevel; i++) {
        const angle = (i / koalasInLevel) * Math.PI * 2;
        const x = Math.cos(angle + level * 0.3) * radius;
        const z = Math.sin(angle + level * 0.3) * radius;
        const y = height + (Math.random() - 0.5) * 0.2;
        const scaleValue = 0.8 + Math.random() * 0.4;
        
        koalaArray.push({
          id: `spiral-${level}-${i}`,
          position: [x, y, z],
          rotation: [0, angle + Math.PI / 2, 0],
          scale: [scaleValue, scaleValue, scaleValue]
        });
      }
    }
    
    // Add central column koalas
    for (let i = 0; i < 15; i++) {
      const scaleValue = 0.6 + Math.random() * 0.3;
      koalaArray.push({
        id: `central-${i}`,
        position: [
          (Math.random() - 0.5) * 0.5,
          i * 0.4,
          (Math.random() - 0.5) * 0.5
        ],
        rotation: [0, 0, 0],
        scale: [scaleValue, scaleValue, scaleValue]
      });
    }
    
    // Add roof koalas
    const roofRadius = 2.2;
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      koalaArray.push({
        id: `roof-${i}`,
        position: [
          Math.cos(angle) * roofRadius,
          6.5,
          Math.sin(angle) * roofRadius
        ],
        rotation: [0, angle, 0],
        scale: [1, 1, 1]
      });
    }
    
    return koalaArray;
  }, []);

  return (
    <group ref={groupRef}>
      {koalas.map((koala) => (
        <Koala
          key={koala.id}
          position={koala.position}
          rotation={koala.rotation}
          scale={koala.scale}
          shape={shape}
        />
      ))}
    </group>
  );
};