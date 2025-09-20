import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ObjectSelector from '@/components/ObjectSelector';

const BlueKoalaGuggenheim = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [shape, setShape] = useState('sphere');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create koala bear geometry (simplified)
    const createKoala = () => {
      const koalaGroup = new THREE.Group();
      const koalaMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });

      // Body (main shape)
      let body;
      if (shape === 'box') {
        body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), koalaMaterial);
      } else if (shape === 'cone') {
        body = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.22, 8), koalaMaterial);
      } else {
        body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), koalaMaterial);
      }
      koalaGroup.add(body);

      // Head (always sphere)
      const headGeometry = new THREE.SphereGeometry(0.1, 8, 6);
      const head = new THREE.Mesh(headGeometry, koalaMaterial);
      head.position.y = 0.2;
      koalaGroup.add(head);

      // Ears
      const earGeometry = new THREE.SphereGeometry(0.04, 6, 4);
      const leftEar = new THREE.Mesh(earGeometry, koalaMaterial);
      leftEar.position.set(-0.07, 0.25, 0.05);
      const rightEar = new THREE.Mesh(earGeometry, koalaMaterial);
      rightEar.position.set(0.07, 0.25, 0.05);
      koalaGroup.add(leftEar, rightEar);

      // Eyes
      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const eyeGeometry = new THREE.SphereGeometry(0.015, 4, 4);
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.03, 0.22, 0.08);
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.03, 0.22, 0.08);
      koalaGroup.add(leftEye, rightEye);

      // Nose
      const noseGeometry = new THREE.SphereGeometry(0.008, 4, 4);
      const nose = new THREE.Mesh(noseGeometry, eyeMaterial);
      nose.position.set(0, 0.2, 0.09);
      koalaGroup.add(nose);

      return koalaGroup;
    };

    // Create Guggenheim spiral structure with koalas
    const guggenheimGroup = new THREE.Group();
    // Create spiral levels
    for (let level = 0; level < 8; level++) {
      const radius = 3 - (level * 0.2);
      const height = level * 0.8;
      const koalasInLevel = Math.max(12 - level, 6);
      for (let i = 0; i < koalasInLevel; i++) {
        const angle = (i / koalasInLevel) * Math.PI * 2;
        const koala = createKoala();
        const x = Math.cos(angle + level * 0.3) * radius;
        const z = Math.sin(angle + level * 0.3) * radius;
        koala.position.set(x, height, z);
        koala.rotation.y = angle + Math.PI / 2;
        koala.scale.setScalar(0.8 + Math.random() * 0.4);
        koala.position.y += (Math.random() - 0.5) * 0.2;
        guggenheimGroup.add(koala);
      }
    }
    // Add central column koalas
    for (let i = 0; i < 15; i++) {
      const koala = createKoala();
      koala.position.set(
        (Math.random() - 0.5) * 0.5,
        i * 0.4,
        (Math.random() - 0.5) * 0.5
      );
      koala.scale.setScalar(0.6 + Math.random() * 0.3);
      guggenheimGroup.add(koala);
    }
    // Add roof koalas
    const roofRadius = 2.2;
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const koala = createKoala();
      koala.position.set(
        Math.cos(angle) * roofRadius,
        6.5,
        Math.sin(angle) * roofRadius
      );
      koala.rotation.y = angle;
      guggenheimGroup.add(koala);
    }
    scene.add(guggenheimGroup);
    // Camera position
    camera.position.set(5, 4, 8);
    camera.lookAt(0, 3, 0);
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (isRotating) {
        guggenheimGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, shape]);

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            The Blue Koala Guggenheim Museum
          </CardTitle>
          <CardDescription>
            A whimsical 3D interpretation of Frank Lloyd Wright's iconic spiral museum, 
            constructed entirely from adorable blue koala bears
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <ObjectSelector value={shape} onChange={setShape} />
          <div 
            ref={mountRef} 
            className="border-2 border-blue-200 rounded-lg shadow-lg"
            style={{ width: '800px', height: '600px' }}
          />
          <button
            onClick={toggleRotation}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isRotating ? 'Stop Rotation' : 'Start Rotation'}
          </button>
          <p className="text-sm text-gray-600 text-center max-w-2xl">
            Each blue koala represents a structural element of the famous Guggenheim Museum. 
            The spiral design showcases how these cuddly creatures form the iconic architecture, 
            creating a playful yet recognizable interpretation of the modernist masterpiece.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlueKoalaGuggenheim;
