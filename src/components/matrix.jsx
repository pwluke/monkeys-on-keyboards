import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// Example Rhino export: list of 4x4 matrices
const matrices = [
  [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  [
    [1, 0, 0, 10],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]
  // … more from Rhino
];

function CubeInstances() {
  return (
    <>
      {matrices.map((m, i) => {
        const mat = new THREE.Matrix4();
        mat.set(
          m[0][0], m[0][1], m[0][2], m[0][3],
          m[1][0], m[1][1], m[1][2], m[1][3],
          m[2][0], m[2][1], m[2][2], m[2][3],
          m[3][0], m[3][1], m[3][2], m[3][3]
        );

        return (
          <mesh key={i} matrix={mat} matrixAutoUpdate={false}>
            <boxGeometry args={[5, 5, 5]} /> {/* Cube size */}
            <meshStandardMaterial color="orange" />
          </mesh>
        );
      })}
    </>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <CubeInstances />
    </Canvas>
  );
}
