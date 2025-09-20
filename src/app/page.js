"use client";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";

export default function Home() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
        <ambientLight intensity={2.5} />
        <directionalLight position={[1, 1, 1]} />
        <Grid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
