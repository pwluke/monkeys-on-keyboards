import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Individual Koala/Monkey component
const ConstructionWorker = ({ position, rotation, scale, colorIndex, colors, hatColor, safetyVest, index }) => {
  const groupRef = useRef();
  const bodyRef = useRef();
  const animSpeed = useMemo(() => 0.02 + Math.random() * 0.01, []);
  
  useFrame((state) => {
    if (bodyRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Body floating animation
      bodyRef.current.position.y = Math.sin(time * animSpeed + index * 0.1) * 0.08;
      
      // Breathing effect
      const breathe = 1 + Math.sin(time * 0.5 + index * 0.05) * 0.05;
      groupRef.current.scale.setScalar(scale * breathe);
    }
  });

  const workerMaterial = (
    <meshPhongMaterial color={colors[colorIndex % colors.length]} />
  );
  
  const darkMaterial = (
    <meshBasicMaterial color={0x222222} />
  );

  const hatMaterial = (
    <meshPhongMaterial color={hatColor} />
  );

  const vestMaterial = (
    <meshPhongMaterial color={0xffa500} />
  );

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        {workerMaterial}
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 2.7, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        {workerMaterial}
      </mesh>
      
      {/* Left Ear */}
      <mesh position={[-0.8, 3.3, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshPhongMaterial color={0x888888} />
      </mesh>
      
      {/* Right Ear */}
      <mesh position={[0.8, 3.3, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshPhongMaterial color={0x888888} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 2.7, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 0.5, 12]} />
        {darkMaterial}
      </mesh>
      
      {/* Hard hat */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 16, 1, false, 0, Math.PI * 2]} />
        {hatMaterial}
      </mesh>
      
      {/* Safety vest */}
      {safetyVest && (
        <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.18, 8, 16, Math.PI]} />
          {vestMaterial}
        </mesh>
      )}
    </group>
  );
};

// Construction site elements
const ConstructionSite = ({ workingHours }) => {
  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[100, 2, 100]} />
        <meshPhongMaterial color={0xcccccc} />
      </mesh>
      
      {/* Crane base */}
      <mesh position={[-30, 10, -30]}>
        <boxGeometry args={[2, 20, 2]} />
        <meshPhongMaterial color={0xffa500} />
      </mesh>
      
      {/* Crane arm */}
      <mesh position={[-20, 20, -30]}>
        <boxGeometry args={[20, 1, 1]} />
        <meshPhongMaterial color={0xffa500} />
      </mesh>
    </group>
  );
};

// Main Construction Monkeys component
export default function ConstructionMonkeys({
  koalaCount = 100,
  constructionPhase = 'planning',
  workingHours = 'day',
  safetyMode = true,
  isRotating = true,
  rotationSpeed = 0.005
}) {
  const groupRef = useRef();

  const phases = {
    planning: { color: 0x4169E1, activity: 'blueprints' },
    foundation: { color: 0x8B4513, activity: 'concrete' },
    framing: { color: 0xFFD700, activity: 'building' },
    systems: { color: 0x32CD32, activity: 'electrical' },
    finishing: { color: 0xFF6347, activity: 'inspection' }
  };

  // Generate worker data in spiral pattern
  const workers = useMemo(() => {
    const workerData = [];
    const spiralRadius = 30;
    const spiralTurns = 2.5;
    const phase = phases[constructionPhase];
    
    for (let i = 0; i < koalaCount; i++) {
      const t = i / koalaCount;
      const angle = spiralTurns * 2 * Math.PI * t;
      const radius = spiralRadius * t;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 1.2 + Math.sin(angle * 2 + i) * 1.5;
      
      const color = 0x8888aa + (i * 0x1111) % 0x2222;
      const hatColor = phase.color;
      
      workerData.push({
        position: [x, y, z],
        rotation: [0, -angle + Math.PI / 2, 0],
        scale: 1,
        colorIndex: i % 4,
        hatColor,
        index: i
      });
    }
    return workerData;
  }, [koalaCount, constructionPhase]);

  const colors = useMemo(() => [0x8888aa, 0x9999bb, 0xaaaacc, 0xbbbbdd], []);

  // Animation loop
  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting for construction site */}
      <ambientLight intensity={workingHours === 'day' ? 1.2 : 0.4} />
      <directionalLight 
        position={[30, 100, 40]} 
        intensity={workingHours === 'day' ? 1.2 : 0.3} 
      />
      {workingHours === 'night' && (
        <pointLight 
          position={[0, 50, 0]} 
          intensity={1} 
          distance={200} 
          color={0xffee88}
        />
      )}
      
      {/* Construction site elements */}
      <ConstructionSite workingHours={workingHours} />
      
      {/* Workers */}
      {workers.map((worker, index) => (
        <ConstructionWorker
          key={index}
          position={worker.position}
          rotation={worker.rotation}
          scale={worker.scale}
          colorIndex={worker.colorIndex}
          colors={colors}
          hatColor={worker.hatColor}
          safetyVest={safetyMode}
          index={worker.index}
        />
      ))}
    </group>
  );
}
