'use client';

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import * as THREE from 'three';

const Shape = ({ type, position, color, scale, rotation }) => {
  const geometry = useMemo(() => {
    switch (type) {
      case 'cube':
        return <boxGeometry args={[scale, scale, scale]} />;
      case 'cylinder':
        return <cylinderGeometry args={[scale / 2, scale / 2, scale, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[scale / 2, 32, 32]} />;
      default:
        return null;
    }
  }, [type, scale]);

  return (
    <mesh position={position} rotation={rotation}>
      {geometry}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default function ArtPiece() {
  const [shapes, setShapes] = useState([]);

  const handlePlaneClick = (event) => {
    if (shapes.length >= 20) return;

    event.stopPropagation();

    const shapeTypes = ['cube', 'cylinder', 'sphere'];
    const randomShapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
    // Double the size of the shapes
    const randomScale = (Math.random() * 0.5 + 0.2) * 2;
    const randomRotation = new THREE.Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const newShape = {
      id: Date.now(),
      type: randomShapeType,
      position: event.point,
      color: randomColor,
      scale: randomScale,
      rotation: randomRotation,
    };

    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  return (
    <>
    <Plane
        args={[10, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handlePlaneClick}
        receiveShadow
      >
        <meshStandardMaterial color="lightblue" />
      </Plane>
      {shapes.map((shape) => (
        <Shape key={shape.id} {...shape} />
      ))}
    </>
  );
}
