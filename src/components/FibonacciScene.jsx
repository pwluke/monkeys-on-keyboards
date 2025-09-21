import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Points, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


  // Particle system component
  const GoldenParticles = () => {
    const pointsRef = useRef();
    const particleCount = 200;
    
    const positions = useMemo(() => {
      const pos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 30;
      }
      return pos;
    }, []);

    useFrame((state) => {
      if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position.array;
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 0.5 + positions[i] * 0.1) * 0.002;
          positions[i] += Math.cos(time * 0.3 + positions[i + 2] * 0.1) * 0.001;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    });

    return (
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0xFFD700}
          size={0.03}
          transparent
          opacity={0.8}
        />
      </points>
    );
  };

  // Individual Koala component
  const Koala = ({ position, rotation, scale, colorIndex, colors, index }) => {
    const groupRef = useRef();
    const bodyRef = useRef();
    const animSpeed = useMemo(() => 0.02 + Math.random() * 0.01, []);
    
    useFrame((state) => {
      if (bodyRef.current && groupRef.current) {
        const time = state.clock.elapsedTime;
        
        // Body floating animation
        bodyRef.current.position.y = Math.sin(time * animSpeed + index * 0.1) * 0.08;
        
        // Breathing effect
        const breathe = 1 + Math.sin(time * 0.5 + index * 0.05) * 0.1;
        groupRef.current.scale.setScalar(scale * breathe);
      }
    });

    const koalaMaterial = (
      <meshLambertMaterial color={colors[colorIndex % colors.length]} />
    );
    
    const darkMaterial = (
      <meshBasicMaterial color={0x000000} />
    );

    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        {/* Body */}
        <mesh ref={bodyRef}>
          <sphereGeometry args={[0.12 * scale, 8, 6]} />
          {koalaMaterial}
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.18 * scale, 0]}>
          <sphereGeometry args={[0.08 * scale, 8, 6]} />
          {koalaMaterial}
        </mesh>
        
        {/* Left Ear */}
        <mesh position={[-0.06 * scale, 0.22 * scale, 0.04 * scale]}>
          <sphereGeometry args={[0.03 * scale, 6, 4]} />
          {koalaMaterial}
        </mesh>
        
        {/* Right Ear */}
        <mesh position={[0.06 * scale, 0.22 * scale, 0.04 * scale]}>
          <sphereGeometry args={[0.03 * scale, 6, 4]} />
          {koalaMaterial}
        </mesh>
        
        {/* Left Eye */}
        <mesh position={[-0.025 * scale, 0.2 * scale, 0.07 * scale]}>
          <sphereGeometry args={[0.012 * scale, 4, 4]} />
          {darkMaterial}
        </mesh>
        
        {/* Right Eye */}
        <mesh position={[0.025 * scale, 0.2 * scale, 0.07 * scale]}>
          <sphereGeometry args={[0.012 * scale, 4, 4]} />
          {darkMaterial}
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, 0.18 * scale, 0.08 * scale]}>
          <sphereGeometry args={[0.006 * scale, 4, 4]} />
          {darkMaterial}
        </mesh>
      </group>
    );
  };

  // Fibonacci Spiral Line component
  const FibonacciSpiral = () => {

    
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    const points = useMemo(() => {
      const spiralPoints = [];
      for (let i = 0; i < 200; i++) {
        const angle = i * goldenAngle;
        const radius = Math.sqrt(i) * 0.5;
        spiralPoints.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(i * 0.1) * 2 + 3,
          Math.sin(angle) * radius
        ));
      }
      return spiralPoints;
    }, [goldenAngle]);

    return (
      <Line
        points={points}
        color={0xFFD700}
        transparent
        opacity={0.3}
        lineWidth={1}
      />
    );
  };

  // Main 3D Scene component
  export default function FibonacciScene() {


  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [colorScheme, setColorScheme] = useState('blue');
  const [koalaCount, setKoalaCount] = useState(100);
  const [cameraAngle, setCameraAngle] = useState('perspective');

  const colorSchemes = {
    blue: [0x4169E1, 0x1E90FF, 0x00BFFF, 0x87CEEB],
    rainbow: [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECCA7, 0xFF9FF3],
    purple: [0x9B59B6, 0x8E44AD, 0x663399, 0xBB8FCE],
    green: [0x27AE60, 0x2ECC71, 0x58D68D, 0x85E085],
    golden: [0xFFD700, 0xFFA500, 0xFF8C00, 0xDAA520]
  };

  // Generate Fibonacci sequence
  const generateFibonacci = (n) => {
    const fib = [1, 1];
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i-1] + fib[i-2];
    }
    return fib;
  };

    const groupRef = useRef();
    // const { camera } = useThree();
    
    const colors = colorSchemes[colorScheme];
    const fibonacci = generateFibonacci(20);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Set camera position based on angle
    // React.useEffect(() => {
    //   switch(cameraAngle) {
    //     case 'top':
    //       camera.position.set(0, 15, 0);
    //       camera.lookAt(0, 0, 0);
    //       break;
    //     case 'side':
    //       camera.position.set(15, 3, 0);
    //       camera.lookAt(0, 3, 0);
    //       break;
    //     case 'front':
    //       camera.position.set(0, 3, 15);
    //       camera.lookAt(0, 3, 0);
    //       break;
    //     case 'isometric':
    //       camera.position.set(10, 10, 10);
    //       camera.lookAt(0, 3, 0);
    //       break;
    //     case 'closeup':
    //       camera.position.set(4, 4, 6);
    //       camera.lookAt(0, 3, 0);
    //       break;
    //     default: // perspective
    //       camera.position.set(8, 6, 12);
    //       camera.lookAt(0, 3, 0);
    //   }
    // }, [cameraAngle, camera]);

    // Generate koala data
    const koalas = useMemo(() => {
      const koalaData = [];
      for (let i = 0; i < koalaCount; i++) {
        const angle = i * goldenAngle;
        const radius = Math.sqrt(i) * 0.5;
        const height = Math.sin(i * 0.1) * 2;
        
        const fibIndex = i % fibonacci.length;
        const scale = 0.7 + (fibonacci[fibIndex] % 8) * 0.1;
        const colorIndex = Math.floor(i / 10) % colors.length;
        
        koalaData.push({
          position: [
            Math.cos(angle) * radius,
            height + 3,
            Math.sin(angle) * radius
          ],
          rotation: [0, angle + Math.PI / 2, 0],
          scale,
          colorIndex,
          index: i
        });
      }
      return koalaData;
    }, [koalaCount, colors.length, fibonacci, goldenAngle]);

    // Animation loop
    useFrame((state) => {
      if (groupRef.current && isRotating) {
        groupRef.current.rotation.y += rotationSpeed;
      }
      
      // Camera auto-orbit for perspective view
    //   if (cameraAngle === 'perspective' && isRotating) {
    //     const time = state.clock.elapsedTime;
    //     const radius = 14;
    //     camera.position.x = Math.cos(time * 0.1) * radius;
    //     camera.position.z = Math.sin(time * 0.1) * radius;
    //     camera.lookAt(0, 3, 0);
    //   }
    });

    return (
      <group ref={groupRef}>
        {/* Lighting */}
        <ambientLight intensity={0.5} color={0x404040} />
        <spotLight
          position={[15, 20, 10]}
          intensity={1.2}
          color={0x4169E1}
          angle={Math.PI / 4}
          penumbra={0.1}
          castShadow
        />
        <spotLight
          position={[-10, 15, -8]}
          intensity={0.8}
          color={0xFFD700}
          angle={Math.PI / 6}
          penumbra={0.1}
        />
        
        {/* Rotating lights */}
        <RotatingLights />
        
        {/* Particles */}
        <GoldenParticles />
        
        {/* Koalas */}
        {koalas.map((koala, index) => (
          <Koala
            key={index}
            position={koala.position}
            rotation={koala.rotation}
            scale={koala.scale}
            colorIndex={koala.colorIndex}
            colors={colors}
            index={koala.index}
          />
        ))}
        
        {/* Fibonacci Spiral */}
        <FibonacciSpiral />
      </group>
    );
  };

  // Rotating lights component
  const RotatingLights = () => {
    const light1Ref = useRef();
    const light2Ref = useRef();
    
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      
      if (light1Ref.current) {
        light1Ref.current.position.x = Math.cos(time * 0.3) * 15;
        light1Ref.current.position.z = Math.sin(time * 0.3) * 15;
      }
      
      if (light2Ref.current) {
        light2Ref.current.position.x = Math.cos(time * 0.4 + Math.PI) * 10;
        light2Ref.current.position.z = Math.sin(time * 0.4 + Math.PI) * 10;
      }
    });

    return (
      <>
        <spotLight
          ref={light1Ref}
          position={[15, 20, 10]}
          intensity={1.2}
          color={0x4169E1}
          angle={Math.PI / 4}
          penumbra={0.1}
        />
        <spotLight
          ref={light2Ref}
          position={[-10, 15, -8]}
          intensity={0.8}
          color={0xFFD700}
          angle={Math.PI / 6}
          penumbra={0.1}
        />
      </>
    );
  };
