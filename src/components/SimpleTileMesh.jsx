"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function SimpleTileMesh({ 
  centerLat = 40.7128, 
  centerLng = -74.0060, 
  zoom = 10,
  meshSize = 1000,
  heightScale = 1,
  onTileLoad
}) {
  const meshRef = useRef();
  const { scene } = useThree();
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert lat/lng to tile coordinates
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const rad2deg = (rad) => rad * (180 / Math.PI);

  const latLngToTile = (lat, lng, zoom) => {
    const n = Math.pow(2, zoom);
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.asinh(Math.tan(deg2rad(lat))) / Math.PI) / 2 * n);
    return { x, y, z: zoom };
  };

  const tileToLatLng = (x, y, z) => {
    const n = Math.pow(2, z);
    const lng = x / n * 360 - 180;
    const lat = rad2deg(Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))));
    return { lat, lng };
  };

  // Create a procedural texture for testing
  const createProceduralTexture = (width, height, lat, lng) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Create a gradient based on coordinates
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const hue = ((lat + 90) * 180 + (lng + 180)) % 360;
    gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${hue + 60}, 60%, 40%)`);
    gradient.addColorStop(1, `hsl(${hue + 120}, 80%, 30%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add some noise
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 50;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
  };

  // Create geometry for a tile
  const createTileGeometry = (width, height, segments = 32) => {
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    
    // Add height variation based on position and noise
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const distance = Math.sqrt(x * x + z * z);
      
      // Create terrain-like height variation
      const height = 
        Math.sin(x * 0.01) * Math.cos(z * 0.01) * 20 +
        Math.sin(x * 0.05) * Math.cos(z * 0.05) * 5 +
        Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 +
        Math.random() * 3;
      
      positions[i + 1] = height * heightScale;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  };

  // Load tiles around center point
  const loadTiles = async () => {
    setIsLoading(true);
    
    try {
      const centerTile = latLngToTile(centerLat, centerLng, zoom);
      const tileRange = 1; // Load 3x3 grid of tiles
      const newTiles = [];

      for (let dx = -tileRange; dx <= tileRange; dx++) {
        for (let dy = -tileRange; dy <= tileRange; dy++) {
          const tileX = centerTile.x + dx;
          const tileY = centerTile.y + dy;
          
          // Skip if tile is out of bounds
          if (tileX < 0 || tileY < 0 || tileX >= Math.pow(2, zoom) || tileY >= Math.pow(2, zoom)) {
            continue;
          }

          const tileLatLng = tileToLatLng(tileX, tileY, zoom);
          
          // Create procedural texture
          const canvas = createProceduralTexture(256, 256, tileLatLng.lat, tileLatLng.lng);
          const texture = new THREE.CanvasTexture(canvas);
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          // Create geometry
          const geometry = createTileGeometry(meshSize, meshSize);
          
          // Create material
          const material = new THREE.MeshLambertMaterial({ 
            map: texture,
            transparent: false
          });

          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          
          // Position the tile
          const worldPos = latLngToWorldPosition(tileLatLng.lat, tileLatLng.lng);
          mesh.position.set(worldPos.x, 0, worldPos.z);
          mesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
          
          newTiles.push({
            mesh,
            tileX,
            tileY,
            tileZ: zoom,
            lat: tileLatLng.lat,
            lng: tileLatLng.lng
          });
        }
      }

      setTiles(newTiles);
      onTileLoad?.(newTiles);
      
    } catch (err) {
      console.error('Error loading tiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert lat/lng to world position
  const latLngToWorldPosition = (lat, lng) => {
    const R = 1000; // Scale factor for world coordinates
    const x = R * Math.cos(deg2rad(lat)) * Math.sin(deg2rad(lng));
    const z = R * Math.cos(deg2rad(lat)) * Math.cos(deg2rad(lng));
    const y = R * Math.sin(deg2rad(lat));
    return { x, y, z };
  };

  // Load tiles on mount and when dependencies change
  useEffect(() => {
    loadTiles();
  }, [centerLat, centerLng, zoom, meshSize, heightScale]);

  // Add tiles to scene
  useEffect(() => {
    tiles.forEach(({ mesh }) => {
      scene.add(mesh);
    });

    return () => {
      tiles.forEach(({ mesh }) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, [tiles, scene]);

  // Animation frame updates
  useFrame(() => {
    if (meshRef.current) {
      // Add any animation here if needed
    }
  });

  return (
    <group ref={meshRef}>
      {/* Debug info */}
      {isLoading && (
        <mesh position={[0, 100, 0]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      )}
      {tiles.length > 0 && (
        <mesh position={[0, 50, 0]}>
          <boxGeometry args={[5, 5, 5]} />
          <meshBasicMaterial color="green" />
        </mesh>
      )}
    </group>
  );
}
