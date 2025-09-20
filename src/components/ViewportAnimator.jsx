"use client";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ViewportAnimator({ 
  activeView, 
  viewPreset, 
  isAnimating, 
  onAnimationComplete 
}) {
  const { camera, controls } = useThree();
  const animationRef = useRef();
  const originalCameraRef = useRef();

  useEffect(() => {
    // Store original camera settings
    if (!originalCameraRef.current) {
      originalCameraRef.current = {
        fov: camera.fov,
        near: camera.near,
        far: camera.far,
        type: camera.type
      };
    }

    if (!viewPreset) return;

    // Store current camera state for animation
    const startPosition = camera.position.clone();
    const startTarget = controls?.target?.clone() || new THREE.Vector3(0, 0, 0);
    
    // Target positions
    const endPosition = new THREE.Vector3(...viewPreset.position);
    const endTarget = new THREE.Vector3(...viewPreset.target);
    
    const startTime = Date.now();
    const duration = 1000; // 1 second animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      // Interpolate positions
      camera.position.lerpVectors(startPosition, endPosition, easeProgress);
      if (controls?.target) {
        controls.target.lerpVectors(startTarget, endTarget, easeProgress);
        controls.update();
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - handle camera type change
        handleCameraTypeChange();
        onAnimationComplete?.();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [viewPreset, camera, controls, onAnimationComplete]);

  const handleCameraTypeChange = () => {
    if (!viewPreset) return;

    const { type } = viewPreset;
    
    // Handle camera type changes
    if (type === "orthographic" && camera.type !== "OrthographicCamera") {
      // Switch to orthographic
      const aspect = camera.aspect;
      const distance = camera.position.distanceTo(controls?.target || new THREE.Vector3(0, 0, 0));
      const size = Math.max(distance * 0.5, 5);
      
      const orthoCamera = new THREE.OrthographicCamera(
        -size * aspect, size * aspect,
        size, -size,
        0.1, 1000
      );
      
      orthoCamera.position.copy(camera.position);
      orthoCamera.quaternion.copy(camera.quaternion);
      orthoCamera.updateProjectionMatrix();
      
      // Replace the camera
      camera.copy(orthoCamera);
    } else if (type === "perspective" && camera.type !== "PerspectiveCamera") {
      // Switch to perspective
      const perspCamera = new THREE.PerspectiveCamera(
        originalCameraRef.current.fov,
        camera.aspect,
        originalCameraRef.current.near,
        originalCameraRef.current.far
      );
      
      perspCamera.position.copy(camera.position);
      perspCamera.quaternion.copy(camera.quaternion);
      perspCamera.updateProjectionMatrix();
      
      // Replace the camera
      camera.copy(perspCamera);
    }

    // Update projection matrix
    camera.updateProjectionMatrix();
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
