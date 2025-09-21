import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as math from 'mathjs';
import _ from 'lodash';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SmartCityKoalas = () => {
  const mountRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [citySize, setCitySize] = useState('medium');
  const [planningPhase, setPlanningPhase] = useState('zoning');
  const [trafficFlow, setTrafficFlow] = useState(true);
  const [sustainabilityMode, setSustainabilityMode] = useState(true);
  const [viewMode, setViewMode] = useState('master');

  const citySizes = { small: 50, medium: 100, large: 150 };
  const phases = {
    zoning: { color: 0x4A90E2, focus: 'planning' },
    infrastructure: { color: 0xFF6B35, focus: 'utilities' },
    transportation: { color: 0x7ED321, focus: 'roads' },
    development: { color: 0xF5A623, focus: 'buildings' },
    sustainability: { color: 0x50E3C2, focus: 'green' }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Professional city planning lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(20, 30, 15);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Traffic flow particle system
    const createTrafficParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(200 * 3);
      const colors = new Float32Array(200 * 3);
      
      for (let i = 0; i < 200; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        colors[i * 3] = trafficFlow ? 0 : 1;
        colors[i * 3 + 1] = trafficFlow ? 1 : 0;
        colors[i * 3 + 2] = 0;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      return new THREE.Points(geometry, material);
    };

    const createKoalaPlanner = (role, position, scale = 1) => {
      const group = new THREE.Group();
      const phase = phases[planningPhase];
      
      // Koala body with role-based coloring
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: phase.color });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.1 * scale, 8, 6), bodyMaterial);
      body.userData = { animSpeed: 0.02 + Math.random() * 0.01, role };
      group.add(body);

      // Head and ears
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.07 * scale, 8, 6), bodyMaterial);
      head.position.y = 0.15 * scale;
      group.add(head);
      
      const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.03 * scale, 6, 4), bodyMaterial);
      leftEar.position.set(-0.05 * scale, 0.2 * scale, 0.03 * scale);
      const rightEar = new THREE.Mesh(new THREE.SphereGeometry(0.03 * scale, 6, 4), bodyMaterial);
      rightEar.position.set(0.05 * scale, 0.2 * scale, 0.03 * scale);
      group.add(leftEar, rightEar);

      // Professional planning tools
      if (role === 'urban_planner') {
        const blueprint = new THREE.Mesh(
          new THREE.PlaneGeometry(0.2 * scale, 0.15 * scale),
          new THREE.MeshBasicMaterial({ color: 0x0066FF, transparent: true, opacity: 0.7 })
        );
        blueprint.position.set(0.15 * scale, 0.1 * scale, 0);
        blueprint.rotation.y = Math.PI / 6;
        group.add(blueprint);
      } else if (role === 'traffic_engineer') {
        const tablet = new THREE.Mesh(
          new THREE.BoxGeometry(0.12 * scale, 0.08 * scale, 0.01 * scale),
          new THREE.MeshBasicMaterial({ color: 0x333333 })
        );
        tablet.position.set(-0.12 * scale, 0.08 * scale, 0);
        group.add(tablet);
      } else if (role === 'sustainability_expert') {
        const solarPanel = new THREE.Mesh(
          new THREE.PlaneGeometry(0.1 * scale, 0.1 * scale),
          new THREE.MeshBasicMaterial({ color: 0x003366 })
        );
        solarPanel.position.set(0, 0.3 * scale, 0);
        solarPanel.rotation.x = -Math.PI / 4;
        group.add(solarPanel);
      }

      // Planning zone indicator
      const zoneIndicator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.02, 8),
        new THREE.MeshBasicMaterial({ 
          color: phase.color, 
          transparent: true, 
          opacity: 0.3 
        })
      );
      zoneIndicator.position.y = -0.1 * scale;
      group.add(zoneIndicator);

      group.position.copy(position);
      return group;
    };

    const cityGroup = new THREE.Group();
    const koalaTeam = [];
    const roles = ['urban_planner', 'traffic_engineer', 'infrastructure_specialist', 'sustainability_expert', 'architect'];

    // City base grid
    const gridSize = 20;
    const cityBase = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize, 10, 10),
      new THREE.MeshLambertMaterial({ 
        color: 0x90EE90, 
        wireframe: false,
        transparent: true,
        opacity: 0.8 
      })
    );
    cityBase.rotation.x = -Math.PI / 2;
    cityBase.position.y = -0.2;
    cityGroup.add(cityBase);

    // Grid lines for urban planning
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x444444, 0x888888);
    gridHelper.position.y = -0.1;
    cityGroup.add(gridHelper);

    // Generate koala city planners using mathematical distribution
    const koalaCount = citySizes[citySize];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < koalaCount; i++) {
      const angle = i * 2 * Math.PI / goldenRatio;
      const radius = Math.sqrt(i) * 0.8;
      const height = Math.sin(i * 0.1) * 0.5;
      
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        height + 0.5,
        Math.sin(angle) * radius
      );
      
      const role = roles[i % roles.length];
      const scale = 0.8 + (i % 3) * 0.2;
      const koala = createKoalaPlanner(role, position, scale);
      
      koala.userData = {
        originalPosition: position.clone(),
        planningArea: Math.floor(i / 10),
        efficiency: Math.random() * 0.5 + 0.5,
        specialization: role
      };
      
      koalaTeam.push(koala);
      cityGroup.add(koala);
    }

    // Traffic flow visualization
    let trafficParticles = null;
    if (trafficFlow) {
      trafficParticles = createTrafficParticles();
      cityGroup.add(trafficParticles);
    }

    // Sustainability features
    if (sustainabilityMode) {
      for (let i = 0; i < 15; i++) {
        const tree = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.8, 6),
          new THREE.MeshLambertMaterial({ color: 0x228B22 })
        );
        tree.position.set(
          (Math.random() - 0.5) * 18,
          0.4,
          (Math.random() - 0.5) * 18
        );
        cityGroup.add(tree);
      }
    }

    scene.add(cityGroup);

    // Camera positioning based on view mode
    const setCameraView = () => {
      switch(viewMode) {
        case 'master':
          camera.position.set(12, 15, 12);
          camera.lookAt(0, 0, 0);
          break;
        case 'aerial':
          camera.position.set(0, 25, 0);
          camera.lookAt(0, 0, 0);
          break;
        case 'street':
          camera.position.set(8, 2, 8);
          camera.lookAt(0, 0, 0);
          break;
        case 'planning':
          camera.position.set(15, 8, 0);
          camera.lookAt(0, 0, 0);
          break;
      }
    };
    setCameraView();

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      // Animate koala planners
      koalaTeam.forEach((koala, index) => {
        const body = koala.children[0];
        
        // Planning work animation
        body.position.y = Math.sin(time * body.userData.animSpeed + index * 0.3) * 0.05;
        
        // Tool animations
        if (koala.children.length > 4 && koala.userData.specialization === 'urban_planner') {
          koala.children[4].rotation.z = Math.sin(time * 0.5 + index) * 0.1;
        }
        
        // Zone planning efficiency visualization
        const zoneIndicator = koala.children[koala.children.length - 1];
        const efficiency = Math.sin(time * 0.3 + index * 0.5) * 0.3 + 0.7;
        zoneIndicator.scale.setScalar(efficiency * koala.userData.efficiency);
      });

      // Traffic flow animation
      if (trafficParticles) {
        const positions = trafficParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(time + i * 0.01) * 0.02;
          positions[i + 2] += Math.cos(time + i * 0.01) * 0.02;
          
          if (Math.abs(positions[i]) > 10) positions[i] *= -0.8;
          if (Math.abs(positions[i + 2]) > 10) positions[i + 2] *= -0.8;
        }
        trafficParticles.geometry.attributes.position.needsUpdate = true;
      }

      if (isAnimating) {
        cityGroup.rotation.y += 0.002;
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
  }, [isAnimating, citySize, planningPhase, trafficFlow, sustainabilityMode, viewMode]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            Smart City Planning Koalas
          </CardTitle>
          <CardDescription>
            Urban planning with {citySizes[citySize]} professional koala planners in {planningPhase} phase
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div 
            ref={mountRef} 
            className="border-2 border-green-200 rounded-lg shadow-lg"
            style={{ width: '800px', height: '600px' }}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-3xl">
            <select value={citySize} onChange={(e) => setCitySize(e.target.value)} className="px-3 py-2 border rounded">
              <option value="small">Small City (50)</option>
              <option value="medium">Medium City (100)</option>
              <option value="large">Large City (150)</option>
            </select>
            
            <select value={planningPhase} onChange={(e) => setPlanningPhase(e.target.value)} className="px-3 py-2 border rounded">
              <option value="zoning">Zoning</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="transportation">Transportation</option>
              <option value="development">Development</option>
              <option value="sustainability">Sustainability</option>
            </select>
            
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="px-3 py-2 border rounded">
              <option value="master">Master Plan</option>
              <option value="aerial">Aerial View</option>
              <option value="street">Street Level</option>
              <option value="planning">Planning Office</option>
            </select>
            
            <button onClick={() => setIsAnimating(!isAnimating)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              {isAnimating ? 'Pause' : 'Resume'} Planning
            </button>
            
            <button onClick={() => setTrafficFlow(!trafficFlow)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Traffic: {trafficFlow ? 'ON' : 'OFF'}
            </button>
            
            <button onClick={() => setSustainabilityMode(!sustainabilityMode)} className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
              Green: {sustainabilityMode ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 text-center max-w-2xl">
            🏙️ Smart City Planning • 🐨 Professional Urban Planners • 🚦 Traffic Management • 🌱 Sustainable Development
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartCityKoalas;
