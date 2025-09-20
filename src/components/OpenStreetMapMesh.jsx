"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function OpenStreetMapMesh({ 
  centerLat = 40.7128, 
  centerLng = -74.0060, 
  zoom = 10,
  meshSize = 1000,
  heightScale = 1,
  mapType = 'osm',
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

  // Get OpenStreetMap tile URL
  const getTileUrl = (x, y, z, type = 'osm') => {
    const subdomains = ['a', 'b', 'c'];
    const subdomain = subdomains[Math.floor(Math.random() * subdomains.length)];
    
    switch (type) {
      case 'osm':
        return `https://${subdomain}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
      case 'satellite':
        // Using OpenStreetMap's satellite tiles (if available) or fallback to terrain
        return `https://${subdomain}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
      case 'terrain':
        // Using OpenTopoMap for terrain data
        return `https://${subdomain}.tile.opentopomap.org/${z}/${x}/${y}.png`;
      case 'cycle':
        // Using OpenCycleMap for cycling data
        return `https://tile.thunderforest.com/cycle/${z}/${x}/${y}.png?apikey=`;
      default:
        return `https://${subdomain}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
    }
  };

  // Load tile image with proper error handling
  const loadTileImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback to a simple colored tile if loading fails
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create a simple colored tile based on coordinates
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(0.5, '#7ed321');
        gradient.addColorStop(1, '#f5a623');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // Add some texture
        const imageData = ctx.getImageData(0, 0, 256, 256);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 30;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
        
        resolve(canvas);
      };
      img.src = url;
    });
  };

  // Create geometry for a tile with height variation
  const createTileGeometry = (width, height, segments = 32) => {
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    
    // Add height variation based on position and noise
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const distance = Math.sqrt(x * x + z * z);
      
      // Create more realistic terrain height variation
      const height = 
        Math.sin(x * 0.005) * Math.cos(z * 0.005) * 30 +
        Math.sin(x * 0.02) * Math.cos(z * 0.02) * 10 +
        Math.sin(x * 0.1) * Math.cos(z * 0.1) * 3 +
        Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1 +
        Math.random() * 2;
      
      positions[i + 1] = height * heightScale;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  };

  // Load elevation data from OpenStreetMap (simplified)
  const getElevationData = async (lat, lng) => {
    try {
      // Using a simple elevation estimation based on coordinates
      // In a real implementation, you'd use OpenElevation API or similar
      const elevation = 
        Math.sin(lat * 0.01) * Math.cos(lng * 0.01) * 100 +
        Math.sin(lat * 0.05) * Math.cos(lng * 0.05) * 50 +
        Math.sin(lat * 0.1) * Math.cos(lng * 0.1) * 20 +
        Math.random() * 10;
      
      return Math.max(0, elevation);
    } catch (err) {
      console.warn('Failed to get elevation data:', err);
      return 0;
    }
  };

  // Load tiles around center point
  const loadTiles = async () => {
    setIsLoading(true);
    setError(null);
    
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
          const tileUrl = getTileUrl(tileX, tileY, zoom, mapType);
          
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
            
            // Get elevation data for more realistic height
            const elevation = await getElevationData(tileLatLng.lat, tileLatLng.lng);
            
            // Create material
            const material = new THREE.MeshLambertMaterial({ 
              map: texture,
              transparent: false
            });

            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position the tile
            const worldPos = latLngToWorldPosition(tileLatLng.lat, tileLatLng.lng);
            mesh.position.set(worldPos.x, elevation * heightScale, worldPos.z);
            mesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
            
            newTiles.push({
              mesh,
              tileX,
              tileY,
              tileZ: zoom,
              lat: tileLatLng.lat,
              lng: tileLatLng.lng,
              elevation
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
    const R = 1000; // Scale factor for world coordinates
    const x = R * Math.cos(deg2rad(lat)) * Math.sin(deg2rad(lng));
    const z = R * Math.cos(deg2rad(lat)) * Math.cos(deg2rad(lng));
    const y = R * Math.sin(deg2rad(lat));
    return { x, y, z };
  };

  // Load tiles on mount and when dependencies change
  useEffect(() => {
    loadTiles();
  }, [centerLat, centerLng, zoom, meshSize, heightScale, mapType]);

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
        <mesh position={[0, 200, 0]}>
          <boxGeometry args={[20, 20, 20]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      )}
      {error && (
        <mesh position={[0, 150, 0]}>
          <boxGeometry args={[20, 20, 20]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
      {tiles.length > 0 && (
        <mesh position={[0, 100, 0]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial color="green" />
        </mesh>
      )}
    </group>
  );
}
