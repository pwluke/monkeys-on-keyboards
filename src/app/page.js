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
import GoogleTileMesh from "@/components/GoogleTileMesh";
import SimpleTileMesh from "@/components/SimpleTileMesh";
import OpenStreetMapMesh from "@/components/OpenStreetMapMesh";
import OpenStreetMapControls from "@/components/OpenStreetMapControls";
import BasicTerrainMesh from "@/components/BasicTerrainMesh";

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
      latitude: 0,
      longitude: 0,
      altitude: 0
    },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");
  const [activeView, setActiveView] = useState("Perspective");
  const [viewPreset, setViewPreset] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tileSettings, setTileSettings] = useState({
    centerLat: 0,
    centerLng: 0,
    zoom: 10,
    meshSize: 200,
    heightScale: 1,
    treeScale: 1,
    mapType: 'osm'
  });
  const [showTileMesh, setShowTileMesh] = useState(false);

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
      latitude: 0,
      longitude: 0,
      altitude: 0
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

  const handleTileSettingsChange = (newSettings) => {
    setTileSettings(newSettings);
  };

  const handleTileLoad = (tiles) => {
    console.log(`Loaded ${tiles.length} tiles`);
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
        <MaterialPicker />
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
        <OpenStreetMapControls 
          settings={tileSettings}
          onSettingsChange={handleTileSettingsChange}
        />
        <div style={{ 
          padding: "12px", 
          background: "white", 
          borderRadius: "8px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
            Terrain Mesh
          </h3>
          <button
            onClick={() => setShowTileMesh(!showTileMesh)}
            style={{
              padding: "6px 12px",
              background: showTileMesh ? "#dc3545" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
              marginBottom: "12px"
            }}
          >
            {showTileMesh ? "Hide" : "Show"} Terrain
          </button>
          
          {showTileMesh && (
            <div style={{ marginTop: "12px" }}>
              <label style={{ 
                display: "block", 
                fontSize: "12px", 
                fontWeight: "500", 
                marginBottom: "6px",
                color: "#333"
              }}>
                Tree Scale: {tileSettings.treeScale.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={tileSettings.treeScale}
                onChange={(e) => setTileSettings(prev => ({ 
                  ...prev, 
                  treeScale: parseFloat(e.target.value) 
                }))}
                style={{
                  width: "100%",
                  height: "6px",
                  background: "#ddd",
                  outline: "none",
                  borderRadius: "3px",
                  cursor: "pointer"
                }}
              />
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: "10px", 
                color: "#666",
                marginTop: "4px"
              }}>
                <span>0.1x</span>
                <span>3.0x</span>
              </div>
            </div>
          )}
          
          <p style={{ 
            margin: "8px 0 0 0", 
            fontSize: "11px", 
            color: "#666",
            lineHeight: "1.4"
          }}>
            Procedural terrain with scalable trees. Guaranteed to work!
          </p>
        </div>
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
        
        {/* Basic Terrain Mesh */}
        {showTileMesh && (
                 <BasicTerrainMesh
                   centerLat={tileSettings.centerLat}
                   centerLng={tileSettings.centerLng}
                   zoom={tileSettings.zoom}
                   meshSize={tileSettings.meshSize}
                   heightScale={tileSettings.heightScale}
                   treeScale={tileSettings.treeScale}
                   onTileLoad={handleTileLoad}
                 />
        )}
        
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

