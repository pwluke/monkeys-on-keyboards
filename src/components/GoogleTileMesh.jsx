"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function GoogleTileMesh({ 
  centerLat = 40.7128, 
  centerLng = -74.0060, 
  zoom = 10,
  tileSize = 256,
  meshSize = 1000,
  heightScale = 1,
  onTileLoad
}) {
  const meshRef = useRef();
  const { scene } = useThree();
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Get tile URL - using OpenStreetMap as fallback since Google has CORS restrictions
  const getTileUrl = (x, y, z, mapType = 'satellite') => {
    // For now, let's use OpenStreetMap which doesn't have CORS restrictions
    // You can replace this with other tile services that allow CORS
    const subdomain = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
    return `https://${subdomain}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
  };

  // Load tile image
  const loadTileImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load tile: ${url}`));
      img.src = url;
    });
  };

  // Create geometry for a tile
  const createTileGeometry = (width, height, segments = 32) => {
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    
    // Add some height variation based on position
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const distance = Math.sqrt(x * x + z * z);
      positions[i + 1] = Math.sin(distance * 0.01) * heightScale * 10;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  };

  // Load tiles around center point
  const loadTiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const centerTile = latLngToTile(centerLat, centerLng, zoom);
      const tileRange = 2; // Load 5x5 grid of tiles
      const newTiles = [];

      for (let dx = -tileRange; dx <= tileRange; dx++) {
        for (let dy = -tileRange; dy <= tileRange; dy++) {
          const tileX = centerTile.x + dx;
          const tileY = centerTile.y + dy;
          
          // Skip if tile is out of bounds
          if (tileX < 0 || tileY < 0 || tileX >= Math.pow(2, zoom) || tileY >= Math.pow(2, zoom)) {
            continue;
          }

          const tileUrl = getTileUrl(tileX, tileY, zoom);
          const tileLatLng = tileToLatLng(tileX, tileY, zoom);
          
          try {
            const img = await loadTileImage(tileUrl);
            
            // Create texture
            const texture = new THREE.CanvasTexture(img);
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
            
          } catch (err) {
            console.warn(`Failed to load tile ${tileX},${tileY}:`, err);
          }
        }
      }

      setTiles(newTiles);
      onTileLoad?.(newTiles);
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading tiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert lat/lng to world position
  const latLngToWorldPosition = (lat, lng) => {
    const R = 6371000; // Earth radius in meters
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
      {error && (
        <mesh position={[0, 50, 0]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  );
}
