"use client";
import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Environment } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import EffectSelector from "@/components/ui/EffectSelector";
import ColorPickerPanel from "@/components/ui/ColorPickerPanel";
import TransformControls from "@/components/TransformControls";
import TransformUI from "@/components/TransformUI";
import ObjectSelectionPanel from "@/components/ObjectSelectionPanel";
import ViewportControls from "@/components/ViewportControls";
import ViewportAnimator from "@/components/ViewportAnimator";
import GeolocationPanel from "@/components/GeolocationPanel";

import ArtPiece from "@/components/ArtPiece";
import Shape from "@/components/shape";
import CubeInstances from "@/components/matrix";
import MatrixInput from "@/components/MatrixInput";
import MaterialPicker from "@/components/mv";


export default function Home() {
  const [objects, setObjects] = useState([
    { 
      type: "box", 
      id: Date.now(), 
      position: [0, 0.5, 0], 
      color: "#ff0000", 
      effect: "matte", 
      rotation: [0, 0, 0], 
      scale: [1, 1, 1],
      latitude: 40.7128,
      longitude: -74.0060,
      altitude: 0
    },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");
  const [activeView, setActiveView] = useState("Perspective");
  const [viewPreset, setViewPreset] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddObject = (type) => {
    const position = [(Math.random() - 0.5) * 4, 0.5, (Math.random() - 0.5) * 4];

    // reasonable defaults
    let color = "#ff0000";
    if (type === "cone") color = "#0000ff";
    if (type === "sphere") color = "#00ff00";

    const newObject = { 
      type, 
      id: Date.now(), 
      position, 
      color, 
      effect: "matte",
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      latitude: 40.7128,
      longitude: -74.0060,
      altitude: 0
    };

    setObjects((prev) => [...prev, newObject]);
    setSelectedId(newObject.id);
  };

  const handleColorChange = (id, newColor) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, color: newColor } : obj)));
  };

  const handleApplyColorToAll = (color) => {
    setObjects((prev) => prev.map((obj) => ({ ...obj, color })));
  };

  const handleEffectChange = (id, newEffect) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, effect: newEffect } : obj)));
  };

  const handleLocationChange = (id, locationData) => {
    setObjects((prev) => prev.map((obj) => 
      obj.id === id ? { ...obj, ...locationData } : obj
    ));
  };

  const handleSelectObject = (id) => {
    setSelectedId(id);
  };

  const handleTransform = (id, transformData) => {
    setObjects((prev) => prev.map((obj) => 
      obj.id === id ? { ...obj, ...transformData } : obj
    ));
  };

  const handleDeleteObject = (id = selectedId) => {
    const targetId = id || selectedId;
    if (targetId) {
      setObjects((prev) => prev.filter(obj => obj.id !== targetId));
      if (targetId === selectedId) {
        setSelectedId(null);
      }
    }
  };

  const handleDuplicateObject = (id = selectedId) => {
    const targetId = id || selectedId;
    if (targetId) {
      const selectedObj = objects.find(obj => obj.id === targetId);
      if (selectedObj) {
        const newObj = {
          ...selectedObj,
          id: Date.now(),
          position: [
            selectedObj.position[0] + 0.5,
            selectedObj.position[1],
            selectedObj.position[2] + 0.5
          ]
        };
        setObjects((prev) => [...prev, newObj]);
        setSelectedId(newObj.id);
      }
    }
  };

  const handleCanvasClick = () => {
    setSelectedId(null);
  };

  const handleViewChange = (viewName, preset) => {
    setActiveView(viewName);
    setViewPreset(preset);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const selectedObject = objects.find(obj => obj.id === selectedId);

  return (
    <div className="h-screen w-screen max-h-screen relative">
      <div className="absolute top-4 left-4 z-10 grid gap-4 max-h-screen overflow-y-auto">
        <ObjectSelector onObjectSelect={handleAddObject} />
        <ObjectSelectionPanel 
          objects={objects}
          selectedId={selectedId}
          onSelect={handleSelectObject}
          onDelete={handleDeleteObject}
          onDuplicate={handleDuplicateObject}
        />
        <ColorPickerPanel objects={objects} onColorChange={handleColorChange} />
        <EffectSelector objects={objects} onEffectChange={handleEffectChange} />
        <MaterialPicker onApplyColorToAll={handleApplyColorToAll} />
        <MatrixInput />
        <TransformUI 
          selectedObject={selectedObject}
          transformMode={transformMode}
          onModeChange={setTransformMode}
          onDelete={handleDeleteObject}
          onDuplicate={handleDuplicateObject}
        />
        <ViewportControls 
          activeView={activeView}
          onViewChange={handleViewChange} 
          isAnimating={isAnimating}
        />
        <GeolocationPanel 
          selectedObject={selectedObject}
          onLocationChange={handleLocationChange}
        />
      </div>

      <Canvas onClick={handleCanvasClick}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} />
        <ArtPiece />
        
        {/* Viewport Animator */}
        <ViewportAnimator 
          activeView={activeView}
          viewPreset={viewPreset}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
        />
        
        {/* Transform Controls System */}
      <TransformControls
          objects={objects}
          selectedId={selectedId}
          onSelect={handleSelectObject}
          onTransform={handleTransform}
          transformMode={transformMode}
          onModeChange={setTransformMode}
        />
        
        <Grid />
        <CubeInstances />
        <OrbitControls enabled={!selectedId} />
        </Canvas>
    </div>
  );
}

