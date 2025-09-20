import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Helper to generate a smooth snake path
// Generates a regular spiral path that grows upward, forming a spiral tower
// Generates a spiral path that grows upward, with phase-based offset for intertwining
function generateSpiralPath(totalPoints, amplitude, spiralRadius, spiralSpacing, phase = 0, reverse = false, intertwinePhase = 0) {
  const points = [];
  for (let i = 0; i < totalPoints; i++) {
    // Reverse direction if needed
    const idx = reverse ? totalPoints - 1 - i : i;
    const t = idx * spiralSpacing;
    // Add intertwinePhase to the angle for each snake
    const angle = t * 0.25 + phase + intertwinePhase + Math.sin(t * 0.15 + intertwinePhase) * 0.15;
    // Intertwine: add a wave offset to the radius
    const intertwineRadius = spiralRadius + Math.sin(t * 0.5 + intertwinePhase) * 1.2;
    const x = Math.cos(angle) * (intertwineRadius + t * 0.05);
    // y increases with t to form a tower, plus a little wave for fun
    const y = t * 0.5 + Math.sin(t * 0.7 + intertwinePhase) * amplitude * 0.2;
    const z = Math.sin(angle) * (intertwineRadius + t * 0.05);
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points);
}



function AnimatedSnake({ color = 'green', spiralPhase = 0, spiralSpacing = 0.25, intertwinePhase = 0 }) {
  const amplitude = 4;
  const spiralRadius = 8;
  const [totalPoints, setTotalPoints] = React.useState(40);
  const [tubeGeometry, setTubeGeometry] = React.useState(() => {
    const curve = generateSpiralPath(totalPoints, amplitude, spiralRadius, spiralSpacing, spiralPhase, false, intertwinePhase);
    return new THREE.TubeGeometry(curve, 120, 0.8, 24, false);
  });
  const meshRef = React.useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // Reverse every 2 minutes (120 seconds)
    const reverse = Math.floor(time / 120) % 2 === 1;
    // Grow the spiral over time (original speed)
    const newPoints = Math.floor(40 + time * 10);
    if (newPoints !== totalPoints) {
      setTotalPoints(newPoints);
    }
    // Animate intertwining by shifting intertwinePhase over time
    const dynamicIntertwine = intertwinePhase + time * 1.2;
    const curve = generateSpiralPath(newPoints, amplitude, spiralRadius, spiralSpacing, spiralPhase, reverse, dynamicIntertwine);
    const newGeometry = new THREE.TubeGeometry(curve, 120, 0.8, 24, false);
    setTubeGeometry(newGeometry);
    if (meshRef.current) {
      meshRef.current.geometry.dispose();
      meshRef.current.geometry = newGeometry;
    }
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}


export default function Snake() {
  // Orange, Green, Purple intertwining spiral towers, green in the middle
  return (
    <>
      <AnimatedSnake color="orange" spiralPhase={0} spiralSpacing={0.18} intertwinePhase={0} />
      <AnimatedSnake color="green" spiralPhase={2 * Math.PI / 3} spiralSpacing={0.25} intertwinePhase={2 * Math.PI / 3} />
      <AnimatedSnake color="purple" spiralPhase={4 * Math.PI / 3} spiralSpacing={0.32} intertwinePhase={4 * Math.PI / 3} />
    </>
  );
}
