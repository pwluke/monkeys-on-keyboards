"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function BasicTerrainMesh({ 
  centerLat = 0, 
  centerLng = 0, 
  zoom = 10,
  meshSize = 200,
  heightScale = 1,
  treeScale = 1,
  onTileLoad
}) {
  const meshRef = useRef();
  const { scene } = useThree();
  const [isLoading, setIsLoading] = useState(false);

  // Create a simple satellite-like texture with trees
  const createSatelliteTexture = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Create a base green color
    ctx.fillStyle = '#6b8e6b';
    ctx.fillRect(0, 0, width, height);
    
    // Add random patches of different colors for natural look
    const colors = [
      '#4a7c59', // Dark green
      '#8fbc8f', // Light green
      '#deb887', // Light brown
      '#f4a460', // Sandy brown
      '#9acd32', // Yellow green
      '#556b2f'  // Olive green
    ];
    
    // Create more fine circle patterns (increased count)
    const circleCount = 50; // Increased from 20 to 50
    const circles = [];
    
    for (let i = 0; i < circleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 30 + 15; // Smaller, more fine circles
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Store circle data for tree placement
      circles.push({ x, y, size, color });
      
      // Draw the circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a darker border to make circles more defined
      ctx.strokeStyle = '#2d4a2d';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Add trees at the center of each circle
    circles.forEach(circle => {
      const { x, y, size } = circle;
      
      // Draw tree trunk
      ctx.fillStyle = '#8b4513'; // Brown trunk
      ctx.fillRect(x - 2, y - size/2, 4, size/2);
      
      // Draw tree canopy
      ctx.fillStyle = '#228b22'; // Dark green canopy
      ctx.beginPath();
      ctx.arc(x, y - size/2, size/3, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some detail to the tree
      ctx.fillStyle = '#32cd32'; // Light green highlights
      ctx.beginPath();
      ctx.arc(x - size/6, y - size/2 - size/6, size/6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + size/6, y - size/2 - size/6, size/6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add some noise for texture
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 15; // Reduced noise
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
  };

  // Create simple flat terrain with 3D trees
  const createTerrain = () => {
    setIsLoading(true);
    console.log('Creating simple satellite terrain with trees...');
    
    try {
      // Create simple plane geometry
      const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 32, 32);
      
      // Create satellite-like texture
      const canvas = createSatelliteTexture(512, 512);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      // Create material
      const material = new THREE.MeshLambertMaterial({ 
        map: texture,
        transparent: false
      });
      
      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
      mesh.userData.isTerrain = true;
      
      // Add to scene
      scene.add(mesh);
      
      // Add 3D trees at random positions
      const treeCount = 30;
      for (let i = 0; i < treeCount; i++) {
        const x = (Math.random() - 0.5) * meshSize * 0.8;
        const z = (Math.random() - 0.5) * meshSize * 0.8;
        
        // Create tree trunk with scale
        const trunkGeometry = new THREE.CylinderGeometry(0.5 * treeScale, 0.8 * treeScale, 8 * treeScale, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: '#8b4513' });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 4 * treeScale, z);
        trunk.userData.isTree = true;
        scene.add(trunk);
        
        // Create tree canopy with scale
        const canopyGeometry = new THREE.SphereGeometry(3 * treeScale, 8, 6);
        const canopyMaterial = new THREE.MeshLambertMaterial({ color: '#228b22' });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(x, 10 * treeScale, z);
        canopy.scale.set(1, 0.8, 1); // Flatten slightly
        canopy.userData.isTree = true;
        scene.add(canopy);
      }
      
      console.log('Simple terrain with trees created successfully');
      onTileLoad?.([{ mesh, lat: centerLat, lng: centerLng }]);
      
    } catch (err) {
      console.error('Error creating terrain:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create terrain on mount
  useEffect(() => {
    createTerrain();
  }, [centerLat, centerLng, zoom, meshSize, heightScale, treeScale]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any meshes
      const children = scene.children.slice();
      children.forEach(child => {
        if (child.userData.isTerrain || child.userData.isTree) {
          scene.remove(child);
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      });
    };
  }, [scene]);

  return (
    <group ref={meshRef}>
      {/* Debug info */}
      {isLoading && (
        <mesh position={[0, 50, 0]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      )}
      {/* Simple indicator */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}
