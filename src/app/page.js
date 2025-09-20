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

import ArtPiece from "@/components/ArtPiece";
import Shape from "@/components/shape";
import CubeInstances from "@/components/matrix";
import MatrixInput from "@/components/MatrixInput";
import MaterialPicker from "@/components/mv";

export default function Home() {
  const [objects, setObjects] = useState([
    { type: "box", id: Date.now(), position: [0, 0.5, 0], color: "#ff0000", effect: "matte", rotation: [0, 0, 0], scale: [1, 1, 1] },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");

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
      scale: [1, 1, 1]
    };

    setObjects((prev) => [...prev, newObject]);
    setSelectedId(newObject.id);
  };

  const handleColorChange = (id, newColor) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, color: newColor } : obj)));
  };

  const handleEffectChange = (id, newEffect) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, effect: newEffect } : obj)));
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

  const selectedObject = objects.find(obj => obj.id === selectedId);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1, display: "grid", gap: 12 }}>
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
        <MaterialPicker />
        <MatrixInput />
        <TransformUI 
          selectedObject={selectedObject}
          transformMode={transformMode}
          onModeChange={setTransformMode}
          onDelete={handleDeleteObject}
          onDuplicate={handleDuplicateObject}
        />
      </div>

      <Canvas onClick={handleCanvasClick}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} />
        <ArtPiece />
        
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
        <OrbitControls />
        </Canvas>
    </div>
  );
}

