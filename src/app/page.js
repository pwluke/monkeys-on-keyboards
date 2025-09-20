"use client";
import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Environment, Edges } from "@react-three/drei";
import { ObjectSelector } from "@/components/ObjectSelector";
import EffectSelector from "@/components/ui/EffectSelector";
import ColorPickerPanel from "@/components/ui/ColorPickerPanel";
import TransformControls from "@/components/TransformControls";
import TransformUI from "@/components/TransformUI";
import ObjectSelectionPanel from "@/components/ObjectSelectionPanel";
import ViewportControls from "@/components/ViewportControls";
import ViewportAnimator from "@/components/ViewportAnimator";
import GeolocationPanel from "@/components/GeolocationPanel";
import BackgroundSwitcher from "@/components/background";
import VideoIntro from "@/components/VideoIntro";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import SceneControls from "@/components/SceneControls";
import Snake from "@/components/snake";

import ArtPiece from "@/components/ArtPiece";
import CubeInstances from "@/components/matrix";
import MatrixInput from "@/components/MatrixInput";
import MaterialPicker from "@/components/mv";
import GuggenheimStructure from "@/components/BlueKoala";

import { ThemeToggle } from "@/components/ThemeToggle";
import { ViewSelector } from "@/components/ViewSelector";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { currentViewAtom, isArcticAtom, isTransparentAtom, isLineweightAtom, showGuggenheimAtom, showCubeInstancesAtom, showArtPieceAtom, showTransformControlsAtom, showViewportControlsAtom, showGeolocationAtom, showSnakeAtom } from "@/lib/atoms";


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
  const [isRotating, setIsRotating] = useState(true);
  const [shape, setShape] = useState('sphere');

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };
  const [selectedId, setSelectedId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");
  const [activeView, setActiveView] = useState("Perspective");
  const [viewPreset, setViewPreset] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideoIntro, setShowVideoIntro] = useState(true);

  // Toggle controls for scene elements
  // const [visibleElements, setVisibleElements] = useState({
  //   cubeInstances: true,
  //   artPiece: true,
  //   guggenheimStructure: true,
  //   transformControls: true
  // });
  const [showGuggenheim, setShowGuggenheim] = useAtom(showGuggenheimAtom);
  const [showCubeInstances, setShowCubeInstances] = useAtom(showCubeInstancesAtom);
  const [showArtPiece, setShowArtPiece] = useAtom(showArtPieceAtom);
  const [showTransformControls, setShowTransformControls] = useAtom(showTransformControlsAtom);
  const [showViewportControls, setShowViewportControls] = useAtom(showViewportControlsAtom);
  const [showGeolocation, setShowGeolocation] = useAtom(showGeolocationAtom);
  const [showSnake, setShowSnake] = useAtom(showSnakeAtom);

  // Collapsible panel states
  const [panelStates, setPanelStates] = useState({
    objectSelector: false,
    objectSelection: false,
    colorPicker: false,
    effectSelector: false,
    materialPicker: false,
    matrixInput: false,
    transformUI: false,
    viewportControls: false,
    geolocation: false
  });
  const [currentView] = useAtom(currentViewAtom);
  const [isArctic] = useAtom(isArcticAtom);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => setMounted(true), []);

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

  const handleSceneLoad = (loadedObjects) => {
    // Deep clone the loaded objects to ensure new references are created,
    // forcing React to re-render the components with the new state.
    setObjects(structuredClone(loadedObjects));
    setSelectedId(null);
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

  const handleVideoIntroComplete = () => {
    setShowVideoIntro(false);
  };


  const togglePanel = (panelName) => {
    setPanelStates(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  };

  const selectedObject = objects.find(obj => obj.id === selectedId);

  return (
    <BackgroundSwitcher>
      {/* Video Intro */}
      {showVideoIntro && <VideoIntro onComplete={handleVideoIntroComplete} />}
      
      <div className="h-screen w-screen max-h-screen relative">
      {/* Toggle Group at the top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="text-sm font-medium mb-2">Scene Elements</div>
        <ToggleGroup 
          type="multiple" 
          className="gap-2"
          value={[
            ...(showCubeInstances ? ['cubeInstances'] : []),
            ...(showArtPiece ? ['artPiece'] : []),
            ...(showGuggenheim ? ['guggenheimStructure'] : []),
            ...(showTransformControls ? ['transformControls'] : []),
            ...(showSnake ? ['snake'] : [])
          ]}
          onValueChange={(values) => {
            console.log('ToggleGroup values changed:', values);
            setShowCubeInstances(values.includes('cubeInstances'));
            setShowArtPiece(values.includes('artPiece'));
            setShowGuggenheim(values.includes('guggenheimStructure'));
            setShowTransformControls(values.includes('transformControls'));
            setShowSnake(values.includes('snake'));
          }}
        >
          <ToggleGroupItem
            value="cubeInstances"
            className="px-3 py-2 text-xs"
          >
            Cube Instances
          </ToggleGroupItem>
          <ToggleGroupItem
            value="artPiece"
            className="px-3 py-2 text-xs"
          >
            Art Piece
          </ToggleGroupItem>
          <ToggleGroupItem
            value="guggenheimStructure"
            className="px-3 py-2 text-xs"
          >
            Guggenheim
          </ToggleGroupItem>
          <ToggleGroupItem
            value="transformControls"
            className="px-3 py-2 text-xs"
          >
            Shapes/Transform
          </ToggleGroupItem>
          <ToggleGroupItem
            value="snake"
            className="px-3 py-2 text-xs"
          >
            Snake
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="absolute top-24 left-4 z-10 grid gap-2 max-h-screen overflow-y-auto w-80">
        {/* Object Selector Panel */}

        <ViewSelector />
        <ThemeToggle theme={theme} />
        <SceneControls
          objects={objects}
          onSceneLoad={handleSceneLoad}
        />
        <Collapsible open={panelStates.objectSelector} onOpenChange={() => togglePanel('objectSelector')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Object Selector</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.objectSelector ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <ObjectSelector onObjectSelect={handleAddObject} />
          </CollapsibleContent>
        </Collapsible>

        {/* Object Selection Panel */}
        <Collapsible open={panelStates.objectSelection} onOpenChange={() => togglePanel('objectSelection')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Object Selection</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.objectSelection ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <ObjectSelectionPanel 
              objects={objects}
              selectedId={selectedId}
              onSelect={handleSelectObject}
              onDelete={handleDeleteObject}
              onDuplicate={handleDuplicateObject}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Color Picker Panel */}
        <Collapsible open={panelStates.colorPicker} onOpenChange={() => togglePanel('colorPicker')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Color Picker</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.colorPicker ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <ColorPickerPanel objects={objects} onColorChange={handleColorChange} />
          </CollapsibleContent>
        </Collapsible>

        {/* Effect Selector Panel */}
        <Collapsible open={panelStates.effectSelector} onOpenChange={() => togglePanel('effectSelector')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Effect Selector</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.effectSelector ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <EffectSelector objects={objects} onEffectChange={handleEffectChange} />
          </CollapsibleContent>
        </Collapsible>

        {/* Material Picker Panel */}
        <Collapsible open={panelStates.materialPicker} onOpenChange={() => togglePanel('materialPicker')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Material Picker</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.materialPicker ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <MaterialPicker onApplyColorToAll={handleApplyColorToAll} />
          </CollapsibleContent>
        </Collapsible>

        {/* Matrix Input Panel */}
        <Collapsible open={panelStates.matrixInput} onOpenChange={() => togglePanel('matrixInput')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Matrix Input</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.matrixInput ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <MatrixInput />
          </CollapsibleContent>
        </Collapsible>

        {/* Transform UI Panel */}
        <Collapsible open={panelStates.transformUI} onOpenChange={() => togglePanel('transformUI')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Transform UI</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.transformUI ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <TransformUI 
              selectedObject={selectedObject}
              transformMode={transformMode}
              onModeChange={setTransformMode}
              onDelete={handleDeleteObject}
              onDuplicate={handleDuplicateObject}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Viewport Controls Panel */}
        <Collapsible open={panelStates.viewportControls} onOpenChange={() => togglePanel('viewportControls')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Viewport Controls</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.viewportControls ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <ViewportControls 
              activeView={activeView}
              onViewChange={handleViewChange} 
              isAnimating={isAnimating}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Geolocation Panel */}
        <Collapsible open={panelStates.geolocation} onOpenChange={() => togglePanel('geolocation')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/95 transition-colors">
            <span className="text-sm font-medium">Geolocation</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${panelStates.geolocation ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <GeolocationPanel 
              selectedObject={selectedObject}
              onLocationChange={handleLocationChange}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Canvas 
        shadows={isArctic} 
        camera={{ position: [-5, 5, 5], fov: 50 }}  
        onClick={handleCanvasClick}>
        <Environment preset="studio" />
        <ambientLight intensity={isArctic ? 4 : 2.5} />
        <directionalLight position={[1, 1, 1]} />
        {showSnake && <Snake />}
        
        {/* Conditionally rendered scene elements */}
        {showArtPiece && <ArtPiece />}
        {showGuggenheim && <GuggenheimStructure isRotating={true} shape="koala" />}
        {showCubeInstances && <CubeInstances />}
        
        {/* Viewport Animator */}
        <ViewportAnimator 
          activeView={activeView}
          viewPreset={viewPreset}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
        />
        
        {/* Transform Controls System - conditionally rendered */}
        {showTransformControls && (
          <TransformControls
            objects={objects}
            selectedId={selectedId}
            onSelect={handleSelectObject}
            onTransform={handleTransform}
            transformMode={transformMode}
            onModeChange={setTransformMode}
          />
        )}
        
        <Grid />
        <OrbitControls enabled={!selectedId} />

        <axesHelper args={[5]} />
        </Canvas>
      </div>
    </BackgroundSwitcher>
  );
}
