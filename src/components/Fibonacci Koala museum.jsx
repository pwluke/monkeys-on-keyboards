import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FibonacciKoalaMuseum = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [colorScheme, setColorScheme] = useState('blue');
  const [koalaCount, setKoalaCount] = useState(100);
  const [cameraAngle, setCameraAngle] = useState('perspective');
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const cameraRef = useRef(null);

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

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001133);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const spotlight1 = new THREE.SpotLight(0x4169E1, 1.2, 100, Math.PI / 4);
    spotlight1.position.set(15, 20, 10);
    spotlight1.castShadow = true;
    scene.add(spotlight1);

    const spotlight2 = new THREE.SpotLight(0xFFD700, 0.8, 100, Math.PI / 6);
    spotlight2.position.set(-10, 15, -8);
    scene.add(spotlight2);

    // Golden ratio particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
      color: 0xFFD700, 
      size: 0.03,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const createKoala = (colorIndex = 0, scale = 1) => {
      const koalaGroup = new THREE.Group();
      const colors = colorSchemes[colorScheme];
      const koalaMaterial = new THREE.MeshLambertMaterial({ 
        color: colors[colorIndex % colors.length] 
      });
      
      // Body with fibonacci scaling
      const bodyGeometry = new THREE.SphereGeometry(0.12 * scale, 8, 6);
      const body = new THREE.Mesh(bodyGeometry, koalaMaterial);
      body.userData = { originalY: 0, animSpeed: Math.random() * 0.03 + 0.02 };
      koalaGroup.add(body);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.08 * scale, 8, 6);
      const head = new THREE.Mesh(headGeometry, koalaMaterial);
      head.position.y = 0.18 * scale;
      koalaGroup.add(head);

      // Ears
      const earGeometry = new THREE.SphereGeometry(0.03 * scale, 6, 4);
      const leftEar = new THREE.Mesh(earGeometry, koalaMaterial);
      leftEar.position.set(-0.06 * scale, 0.22 * scale, 0.04 * scale);
      const rightEar = new THREE.Mesh(earGeometry, koalaMaterial);
      rightEar.position.set(0.06 * scale, 0.22 * scale, 0.04 * scale);
      koalaGroup.add(leftEar, rightEar);

      // Eyes and nose
      const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const eyeGeometry = new THREE.SphereGeometry(0.012 * scale, 4, 4);
      const leftEye = new THREE.Mesh(eyeGeometry, darkMaterial);
      leftEye.position.set(-0.025 * scale, 0.2 * scale, 0.07 * scale);
      const rightEye = new THREE.Mesh(eyeGeometry, darkMaterial);
      rightEye.position.set(0.025 * scale, 0.2 * scale, 0.07 * scale);
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.006 * scale, 4, 4), darkMaterial);
      nose.position.set(0, 0.18 * scale, 0.08 * scale);
      koalaGroup.add(leftEye, rightEye, nose);

      return koalaGroup;
    };

    const fibonacciGroup = new THREE.Group();
    const koalas = [];
    const fibonacci = generateFibonacci(20);

    // Create Fibonacci spiral arrangement
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle ~137.5°
    
    for (let i = 0; i < koalaCount; i++) {
      const angle = i * goldenAngle;
      const radius = Math.sqrt(i) * 0.5; // Spiral outward based on sqrt
      const height = Math.sin(i * 0.1) * 2; // Wave height based on position
      
      // Use Fibonacci numbers for scaling and color variation
      const fibIndex = i % fibonacci.length;
      const scale = 0.7 + (fibonacci[fibIndex] % 8) * 0.1;
      const colorIndex = Math.floor(i / 10) % colorSchemes[colorScheme].length;
      
      const koala = createKoala(colorIndex, scale);
      
      koala.position.set(
        Math.cos(angle) * radius,
        height + 3,
        Math.sin(angle) * radius
      );
      
      koala.rotation.y = angle + Math.PI / 2;
      koala.userData = { 
        originalAngle: angle,
        originalRadius: radius,
        originalHeight: height,
        fibScale: scale,
        index: i
      };
      
      koalas.push(koala);
      fibonacciGroup.add(koala);
    }

    // Add central golden spiral visualization
    const spiralGeometry = new THREE.BufferGeometry();
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
    spiralGeometry.setFromPoints(spiralPoints);
    const spiralMaterial = new THREE.LineBasicMaterial({ 
      color: 0xFFD700, 
      transparent: true, 
      opacity: 0.3 
    });
    const spiralLine = new THREE.Line(spiralGeometry, spiralMaterial);
    fibonacciGroup.add(spiralLine);

    scene.add(fibonacciGroup);
    
    // Set initial camera position
    const setCameraPosition = (angle) => {
      switch(angle) {
        case 'top':
          camera.position.set(0, 15, 0);
          camera.lookAt(0, 0, 0);
          break;
        case 'side':
          camera.position.set(15, 3, 0);
          camera.lookAt(0, 3, 0);
          break;
        case 'front':
          camera.position.set(0, 3, 15);
          camera.lookAt(0, 3, 0);
          break;
        case 'isometric':
          camera.position.set(10, 10, 10);
          camera.lookAt(0, 3, 0);
          break;
        case 'closeup':
          camera.position.set(4, 4, 6);
          camera.lookAt(0, 3, 0);
          break;
        default: // perspective
          camera.position.set(8, 6, 12);
          camera.lookAt(0, 3, 0);
      }
    };
    
    setCameraPosition(cameraAngle);

    // Mouse controls with camera angle awareness
    const handleMouseMove = (event) => {
      if (mouseRef.current.isDown) {
        const deltaX = event.clientX - mouseRef.current.x;
        const deltaY = event.clientY - mouseRef.current.y;
        
        if (cameraAngle === 'perspective' || cameraAngle === 'isometric') {
          // Only allow rotation for perspective views
          fibonacciGroup.rotation.y += deltaX * 0.01;
          camera.position.y += deltaY * 0.02;
          camera.lookAt(0, 3, 0);
        } else {
          // For fixed angles, rotate the whole scene
          fibonacciGroup.rotation.y += deltaX * 0.01;
          fibonacciGroup.rotation.x += deltaY * 0.01;
        }
      }
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    renderer.domElement.addEventListener('mousedown', () => mouseRef.current.isDown = true);
    renderer.domElement.addEventListener('mouseup', () => mouseRef.current.isDown = false);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;
      
      // Koala fibonacci wave animation
      koalas.forEach((koala, index) => {
        const body = koala.children[0];
        body.position.y = body.userData.originalY + Math.sin(time * body.userData.animSpeed + index * 0.1) * 0.08;
        
        // Optional: Fibonacci spiral breathing effect
        const breathe = 1 + Math.sin(time * 0.5 + index * 0.05) * 0.1;
        koala.scale.setScalar(koala.userData.fibScale * breathe);
      });

      // Particle golden ratio movement
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.5 + positions[i] * 0.1) * 0.002;
        positions[i] += Math.cos(time * 0.3 + positions[i + 2] * 0.1) * 0.001;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Rotating golden lights
      spotlight1.position.x = Math.cos(time * 0.3) * 15;
      spotlight1.position.z = Math.sin(time * 0.3) * 15;
      spotlight2.position.x = Math.cos(time * 0.4 + Math.PI) * 10;
      spotlight2.position.z = Math.sin(time * 0.4 + Math.PI) * 10;

      // Camera auto-orbit for some angles
      if (cameraAngle === 'perspective' && isRotating) {
        const radius = 14;
        camera.position.x = Math.cos(time * 0.1) * radius;
        camera.position.z = Math.sin(time * 0.1) * radius;
        camera.lookAt(0, 3, 0);
      }

      if (isRotating) {
        fibonacciGroup.rotation.y += rotationSpeed;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, rotationSpeed, colorScheme, koalaCount, cameraAngle]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text text-transparent">
            Fibonacci Koala Spiral Museum
          </CardTitle>
          <CardDescription>
            Mathematical beauty: {koalaCount} koalas arranged in the golden ratio spiral
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div 
            ref={mountRef} 
            className="border-2 border-yellow-200 rounded-lg shadow-lg cursor-grab"
            style={{ width: '800px', height: '600px' }}
          />
          
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              {isRotating ? 'Pause' : 'Rotate'}
            </button>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="0.001"
                max="0.02"
                step="0.001"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
            
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="blue">Ocean Blue</option>
              <option value="rainbow">Rainbow</option>
              <option value="purple">Purple Magic</option>
              <option value="green">Forest Green</option>
              <option value="golden">Golden Ratio</option>
            </select>
            
            <select
              value={koalaCount}
              onChange={(e) => setKoalaCount(parseInt(e.target.value))}
              className="px-3 py-1 border rounded"
            >
              <option value={10}>10 Koalas</option>
              <option value={50}>50 Koalas</option>
              <option value={100}>100 Koalas</option>
            </select>
            
            <select
              value={cameraAngle}
              onChange={(e) => setCameraAngle(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="perspective">Perspective</option>
              <option value="top">Top View</option>
              <option value="side">Side View</option>
              <option value="front">Front View</option>
              <option value="isometric">Isometric</option>
              <option value="closeup">Close-up</option>
            </select>
          </div>
          
          <p className="text-sm text-gray-600 text-center max-w-2xl">
            🌀 Golden Ratio Spiral • 🧮 Fibonacci Scaling • 📐 Multi-angle views • 🖱️ Drag to explore • ✨ Mathematical harmony!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FibonacciKoalaMuseum;
