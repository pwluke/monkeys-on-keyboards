"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import ClickableObject from "./ClickableObject";

// Transform Controls Component
export default function TransformControlsPanel({ 
  objects, 
  selectedId, 
  onSelect, 
  onTransform, 
  transformMode, 
  onModeChange 
}) {
  const objectRefs = useRef({});
  const selectedObject = useMemo(() => 
    objects.find(obj => obj.id === selectedId), [objects, selectedId]
  );
  const selectedObjectRef = useMemo(() => 
    selectedId ? objectRefs.current[selectedId] : null, [selectedId]
  );

  // Keyboard shortcuts for transform modes and deselection
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'g') {
        onModeChange("translate");
      } else if (event.key.toLowerCase() === 'r') {
        onModeChange("rotate");
      } else if (event.key.toLowerCase() === 's') {
        onModeChange("scale");
      } else if (event.key === 'Escape') {
        onSelect(null); // Deselect all objects when ESC is pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onModeChange, onSelect]);

  return (
    <>
      {/* Object Selection and Transform Controls */}
      {objects.map((obj) => (
        <ClickableObject
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedId}
          onSelect={() => onSelect(obj.id)}
          objectRef={(ref) => {
            if (ref) {
              objectRefs.current[obj.id] = ref;
            } else {
              delete objectRefs.current[obj.id];
            }
          }}
        />
      ))}

      {/* Transform Gizmo */}
      {selectedObjectRef && (
        <TransformControls
          object={selectedObjectRef}
          mode={transformMode}
          onObjectChange={(e) => {
            const obj = e.target.object;
            onTransform(selectedId, {
              position: [obj.position.x, obj.position.y, obj.position.z],
              rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
              scale: [obj.scale.x, obj.scale.y, obj.scale.z]
            });
          }}
        />
      )}
    </>
  );
}

