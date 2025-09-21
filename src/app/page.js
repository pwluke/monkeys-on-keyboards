"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AECKoalaConstructionSite = () => {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [koalaCount, setKoalaCount] = useState(100);
  const [cameraAngle, setCameraAngle] = useState('perspective');
  const [constructionPhase, setConstructionPhase] = useState('planning');
  const [workingHours, setWorkingHours] = useState('day');
  const [safetyMode, setSafetyMode] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  const phases = {
    planning: { color: 0x4169E1, activity: 'blueprints' },
    foundation: { color: 0x8B4513, activity: 'concrete' },
    framing: { color: 0xFFD700, activity: 'building' },
    systems: { color: 0x32CD32, activity: 'electrical' },
    finishing: { color: 0xFF6347, activity: 'inspection' }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Clean up previous scene
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(workingHours === 'day' ? 0xbfd1e5 : 0x222233);

    // Camera
    let camera;
    const aspect = 800 / 600;
    if (cameraAngle === 'perspective') {
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      camera.position.set(0, 40, 80);
    } else if (cameraAngle === 'top') {
      camera = new THREE.OrthographicCamera(-40 * aspect, 40 * aspect, 40, -40, 0.1, 1000);
      camera.position.set(0, 100, 0);
      camera.lookAt(0, 0, 0);
    } else if (cameraAngle === 'side') {
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      camera.position.set(80, 20, 0);
    } else if (cameraAngle === 'front') {
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      camera.position.set(0, 20, 80);
    } else if (cameraAngle === 'isometric') {
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      camera.position.set(60, 60, 60);
    } else if (cameraAngle === 'closeup') {
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      camera.position.set(0, 10, 20);
    }
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, workingHours === 'day' ? 1.2 : 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, workingHours === 'day' ? 1.2 : 0.3);
    dirLight.position.set(30, 100, 40);
    scene.add(dirLight);
    if (workingHours === 'night') {
      const nightLight = new THREE.PointLight(0xffee88, 1, 200);
      nightLight.position.set(0, 50, 0);
      scene.add(nightLight);
    }

    // Ground
    const groundGeo = new THREE.BoxGeometry(100, 2, 100);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    scene.add(ground);

    // Construction elements (cranes, beams, etc.)
    const craneMat = new THREE.MeshPhongMaterial({ color: 0xffa500 });
    const craneBase = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 2), craneMat);
    craneBase.position.set(-30, 10, -30);
    scene.add(craneBase);
    const craneArm = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 1), craneMat);
    craneArm.position.set(-20, 20, -30);
    scene.add(craneArm);

    // Koala geometry (simple stylized)
    function createKoala(color, hatColor, safetyVest) {
      const group = new THREE.Group();
      // Body
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshPhongMaterial({ color })
      );
      body.position.y = 1.2;
      group.add(body);
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshPhongMaterial({ color })
      );
      head.position.y = 2.7;
      group.add(head);
      // Ears
      const earL = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 12),
        new THREE.MeshPhongMaterial({ color: 0x888888 })
      );
      earL.position.set(-0.8, 3.3, 0);
      group.add(earL);
      const earR = earL.clone();
      earR.position.x = 0.8;
      group.add(earR);
      // Nose
      const nose = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.28, 0.5, 12),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
      );
      nose.position.set(0, 2.7, 0.8);
      nose.rotation.x = Math.PI / 2;
      group.add(nose);
      // Hard hat
      const hat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.3, 16, 1, false, 0, Math.PI * 2),
        new THREE.MeshPhongMaterial({ color: hatColor })
      );
      hat.position.set(0, 3.2, 0);
      group.add(hat);
      // Safety vest
      if (safetyVest) {
        const vest = new THREE.Mesh(
          new THREE.TorusGeometry(0.9, 0.18, 8, 16, Math.PI),
          new THREE.MeshPhongMaterial({ color: 0xffa500 })
        );
        vest.position.set(0, 1.7, 0);
        vest.rotation.x = Math.PI / 2;
        group.add(vest);
      }
      return group;
    }

    // Place koalas in a spiral (Fibonacci-like)
    const spiralRadius = 30;
    const spiralTurns = 2.5;
    for (let i = 0; i < koalaCount; i++) {
      const t = i / koalaCount;
      const angle = spiralTurns * 2 * Math.PI * t;
      const radius = spiralRadius * t;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 1.2 + Math.sin(angle * 2 + i) * 1.5;
      const phase = phases[constructionPhase];
      const color = 0x8888aa + (i * 0x1111) % 0x2222;
      const hatColor = phase.color;
      const koala = createKoala(color, hatColor, safetyMode);
      koala.position.set(x, y, z);
      koala.rotation.y = -angle + Math.PI / 2;
      scene.add(koala);
    }

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    mountRef.current.appendChild(renderer.domElement);

    // Animation
    let frameId;
    let groupRotation = 0;
    const animate = () => {
      if (isRotating) {
        groupRotation += rotationSpeed;
        scene.rotation.y = groupRotation;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Mouse drag to rotate
    const handleMouseDown = (e) => {
      mouseRef.current.isDown = true;
      mouseRef.current.x = e.clientX;
    };
    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };
    const handleMouseMove = (e) => {
      if (mouseRef.current.isDown) {
        const dx = e.clientX - mouseRef.current.x;
        groupRotation += dx * 0.005;
        mouseRef.current.x = e.clientX;
      }
    };
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [isRotating, rotationSpeed, koalaCount, cameraAngle, constructionPhase, workingHours, safetyMode]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            AEC Fibonacci Koala Construction Site
          </CardTitle>
          <CardDescription>
            Professional construction site with {koalaCount} koala workers in {constructionPhase} phase
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div 
            ref={mountRef}
            className="border-2 border-orange-200 rounded-lg shadow-lg cursor-grab"
            style={{ width: '800px', height: '600px' }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-3xl">
            <select value={koalaCount} onChange={(e) => setKoalaCount(parseInt(e.target.value))} className="px-2 py-1 border rounded text-sm">
              <option value={25}>25 Workers</option>
              <option value={50}>50 Workers</option>
              <option value={100}>100 Workers</option>
            </select>
            <select value={cameraAngle} onChange={(e) => setCameraAngle(e.target.value)} className="px-2 py-1 border rounded text-sm">
              <option value="perspective">Site View</option>
              <option value="top">Top View</option>
              <option value="side">Side View</option>
              <option value="front">Front View</option>
              <option value="isometric">Isometric</option>
              <option value="closeup">Close-up</option>
            </select>
            <select value={constructionPhase} onChange={(e) => setConstructionPhase(e.target.value)} className="px-2 py-1 border rounded text-sm">
              <option value="planning">Planning</option>
              <option value="foundation">Foundation</option>
              <option value="framing">Framing</option>
              <option value="systems">Systems</option>
              <option value="finishing">Finishing</option>
            </select>
            <select value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} className="px-2 py-1 border rounded text-sm">
              <option value="day">Day Shift</option>
              <option value="night">Night Shift</option>
            </select>
            <button onClick={() => setIsRotating(!isRotating)} className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600">
              {isRotating ? 'Pause' : 'Resume'}
            </button>
            <button onClick={() => setSafetyMode(!safetyMode)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
              Safety: {safetyMode ? 'ON' : 'OFF'}
            </button>
            <div className="flex items-center gap-1">
              <label className="text-xs">Speed:</label>
              <input type="range" min="0.001" max="0.02" step="0.001" value={rotationSpeed} onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} className="w-16" />
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            🏗️ Professional AEC Site • 👷 Koala Workers • 📐 BIM Integration • 🚁 Drone Surveys • ⚠️ Safety First!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AECKoalaConstructionSite;
