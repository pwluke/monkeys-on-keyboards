"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Snake from "@/components/snake";


export default function Home() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} />
        <Snake />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

