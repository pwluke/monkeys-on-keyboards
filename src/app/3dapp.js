import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, TransformControls, StatsGl } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three-stdlib";

// ----------------------------- UI helpers (shadcn/ui minimal inline) -----------------------------
// If your app already has shadcn/ui set up, swap these with the real imports.
const Button = ({ className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-2xl shadow-sm border bg-white hover:bg-gray-50 active:translate-y-px text-sm ${className}`}
    {...props}
  />
);

const IconButton = ({ className = "", children, ...props }) => (
  <button
    className={`p-2 rounded-xl border bg-white hover:bg-gray-50 shadow-sm text-gray-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Select = ({ value, onChange, children, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    className={`px-3 py-2 rounded-xl border bg-white shadow-sm text-sm ${className}`}
  >
    {children}
  </select>
);

const Label = ({ children, className = "" }) => (
  <label className={`text-xs text-gray-600 ${className}`}>{children}</label>
);

const TextInput = ({ className = "", ...props }) => (
  <input
    className={`px-3 py-2 rounded-xl border bg-white shadow-sm text-sm ${className}`}
    {...props}
  />
);

// ----------------------------- Types & helpers -----------------------------
const makeId = () => Math.random().toString(36).slice(2, 9);

const PRIMITIVES = {
  Box: () => new THREE.BoxGeometry(1, 1, 1),
  Sphere: () => new THREE.SphereGeometry(0.6, 32, 16),
  Cone: () => new THREE.ConeGeometry(0.6, 1, 24),
  Cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
  Plane: () => new THREE.PlaneGeometry(1, 1),
};

const PRESET_VIEWS = {
  Isometric: { position: [5, 5, 5], target: [0, 0, 0] },
  Front: { position: [0, 0, 8], target: [0, 0, 0] },
  Right: { position: [8, 0, 0], target: [0, 0, 0] },
  Top: { position: [0, 8, 0], target: [0, 0, 0] },
  Back: { position: [0, 0, -8], target: [0, 0, 0] },
};

// ----------------------------- Scene Objects -----------------------------
function SelectableMesh({ item, selected, onPointerDown, onChangeColor }) {
  const ref = useRef();
  const geometry = useMemo(() => PRIMITIVES[item.type](), [item.type]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Subtle outline when selected
  useFrame(() => {
    if (!ref.current) return;
    ref.current.traverse?.((o) => (o.isMesh ? (o.material.emissive = new THREE.Color(selected ? 0x222222 : 0x000000)) : null));
  });

  return (
    <group
      ref={ref}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown?.(item.id);
      }}
    >
      <mesh castShadow receiveShadow>
        <primitive attach="geometry" object={geometry} />
        <meshStandardMaterial color={item.color} metalness={0.05} roughness={0.7} />
      </mesh>
    </group>
  );
}

function CameraRig({ activeView, viewLerp = 0.12 }) {
  const { camera, controls } = useThree((s) => ({ camera: s.camera, controls: s.controls }));
  const targetRef = useRef(new THREE.Vector3());
  const posRef = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!activeView) return;
    posRef.current.set(...activeView.position);
    targetRef.current.set(...activeView.target);
  }, [activeView]);

  useFrame(() => {
    if (!activeView) return;
    camera.position.lerp(posRef.current, viewLerp);
    controls?.target.lerp(targetRef.current, viewLerp);
    controls?.update();
  });
  return null;
}

// ----------------------------- Main Component -----------------------------
export default function ThreePlayground() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bg, setBg] = useState("#fafafa");
  const [presetViewKey, setPresetViewKey] = useState("Isometric");
  const [savedViews, setSavedViews] = useState([]); // {name, position:[x,y,z], target:[x,y,z]}

  const selectedItem = useMemo(() => items.find((i) => i.id === selectedId) || null, [items, selectedId]);

  const addPrimitive = (type) => {
    const id = makeId();
    setItems((prev) => [
      ...prev,
      {
        id,
        type,
        position: [Math.random() * 2 - 1, 0.5, Math.random() * 2 - 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: "#8b5cf6", // violet-500
      },
    ]);
    setSelectedId(id);
  };

  const updateSelected = (patch) => {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selectedItem) return;
    const id = makeId();
    setItems((prev) => [
      ...prev,
      { ...selectedItem, id, position: [selectedItem.position[0] + 0.5, selectedItem.position[1], selectedItem.position[2] + 0.5] },
    ]);
    setSelectedId(id);
  };

  const clearAll = () => {
    setItems([]);
    setSelectedId(null);
  };

  // ----------------------------- Export / Import -----------------------------
  const exportJSON = () => {
    const data = JSON.stringify({ items, bg }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scene.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setItems(Array.isArray(data.items) ? data.items : []);
        if (data.bg) setBg(data.bg);
      } catch (err) {
        console.error("Failed to parse JSON", err);
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const exportGLTF = () => {
    const scene = new THREE.Scene();
    // Rebuild meshes for export
    items.forEach((i) => {
      const geom = PRIMITIVES[i.type]();
      const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(i.color) });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.fromArray(i.position);
      mesh.rotation.set(i.rotation[0], i.rotation[1], i.rotation[2]);
      mesh.scale.fromArray(i.scale);
      scene.add(mesh);
    });
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: "model/gltf+json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scene.gltf";
        a.click();
        URL.revokeObjectURL(url);
      },
      { binary: false }
    );
  };

  // ----------------------------- Saved views -----------------------------
  const SaveViewButton = () => {
    const { camera, controls } = useThree();
    const save = () => {
      const name = prompt("Name this view:", `View ${savedViews.length + 1}`);
      if (!name) return;
      const position = camera.position.toArray();
      const target = controls?.target?.toArray?.() || [0, 0, 0];
      setSavedViews((v) => [...v, { name, position, target }]);
    };
    return (
      <Button onClick={save} title="Save current camera as a view">Save View</Button>
    );
  };

  const GoToView = ({ view }) => {
    const { camera, controls } = useThree();
    useEffect(() => {
      if (!view) return;
      camera.position.set(...view.position);
      controls?.target.set(...view.target);
      controls?.update();
    }, [view]);
    return null;
  };

  // ----------------------------- Inspector -----------------------------
  const Inspector = () => {
    if (!selectedItem) return (
      <div className="text-xs text-gray-500 italic">No selection</div>
    );
    const [x, y, z] = selectedItem.position;
    const [rx, ry, rz] = selectedItem.rotation;
    const [sx, sy, sz] = selectedItem.scale;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label>Color</Label>
          <input
            type="color"
            value={selectedItem.color}
            onChange={(e) => updateSelected({ color: e.target.value })}
            className="h-8 w-10 rounded-md border p-0"
            title="Pick color"
          />
          <TextInput
            value={selectedItem.color}
            onChange={(e) => updateSelected({ color: e.target.value })}
            className="w-28"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 items-center">
          <Label className="col-span-1">Position</Label>
          {(["x", "y", "z"] ).map((axis, i) => (
            <TextInput
              key={axis}
              type="number"
              step="0.1"
              value={[x, y, z][i]}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const arr = [x, y, z];
                arr[i] = isNaN(val) ? 0 : val;
                updateSelected({ position: arr });
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 items-center">
          <Label className="col-span-1">Rotation</Label>
          {(["x", "y", "z"] ).map((axis, i) => (
            <TextInput
              key={axis}
              type="number"
              step="0.1"
              value={[rx, ry, rz][i]}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const arr = [rx, ry, rz];
                arr[i] = isNaN(val) ? 0 : val;
                updateSelected({ rotation: arr });
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 items-center">
          <Label className="col-span-1">Scale</Label>
          {(["x", "y", "z"] ).map((axis, i) => (
            <TextInput
              key={axis}
              type="number"
              step="0.1"
              value={[sx, sy, sz][i]}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const arr = [sx, sy, sz];
                arr[i] = isNaN(val) ? 1 : val;
                updateSelected({ scale: arr });
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={duplicateSelected}>Duplicate</Button>
          <Button onClick={deleteSelected} className="text-red-600 border-red-200">Delete</Button>
        </div>
      </div>
    );
  };

  // ----------------------------- Transform gizmo -----------------------------
  function GizmoWrapper() {
    const [mode, setMode] = useState("translate");
    const { camera, gl } = useThree();
    const selected = selectedItem;

    const objRef = useRef(null);

    // Build a dummy object3D to attach TransformControls when selection changes
    useEffect(() => {
      if (!selected) return;
      const o = new THREE.Object3D();
      o.position.fromArray(selected.position);
      o.rotation.set(...selected.rotation);
      o.scale.fromArray(selected.scale);
      objRef.current = o;
    }, [selectedId]);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === "g") setMode("translate");
        if (e.key === "r") setMode("rotate");
        if (e.key === "s") setMode("scale");
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    if (!selected) return null;

    return (
      <TransformControls
        object={objRef.current}
        mode={mode}
        onObjectChange={(e) => {
          const o = objRef.current;
          if (!o) return;
          updateSelected({
            position: o.position.toArray(),
            rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
            scale: o.scale.toArray(),
          });
        }}
      />
    );
  }

  // ----------------------------- Canvas overlay click handler -----------------------------
  const SceneClicks = () => {
    const { scene, camera } = useThree();
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const pointer = useMemo(() => new THREE.Vector2(), []);

    const onPointerDown = (e) => {
      // If clicking on empty space, deselect
      if (e.intersections.length === 0) {
        setSelectedId(null);
      }
    };
    return <group onPointerDown={onPointerDown} />;
  };

  // ----------------------------- Toolbar & Layout -----------------------------
  return (
    <div className="w-full h-[80vh] rounded-2xl border bg-white grid grid-cols-[280px,1fr] overflow-hidden">
      {/* Sidebar */}
      <div className="h-full border-r p-3 flex flex-col gap-3 bg-gradient-to-b from-white to-gray-50">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">3D Canvas</h2>
          <p className="text-xs text-gray-500">Add primitives, select, color, save & manage views.</p>
        </div>

        <div className="space-y-2">
          <Label>Add primitive</Label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(PRIMITIVES).map((k) => (
              <Button key={k} onClick={() => addPrimitive(k)}>{k}</Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Background</Label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-10 rounded-md border p-0" />
            <TextInput value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preset view</Label>
          <Select value={presetViewKey} onChange={setPresetViewKey} className="w-full">
            {Object.keys(PRESET_VIEWS).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </Select>
          <div className="flex gap-2">
            <SaveViewButton />
          </div>
          {savedViews.length > 0 && (
            <div className="space-y-1">
              <Label>Saved views</Label>
              <div className="flex flex-wrap gap-2">
                {savedViews.map((v, idx) => (
                  <Button key={idx} onClick={() => setPresetViewKey("") || setSavedViews((sv) => sv) /* no-op */} className="" title={`Go to ${v.name}`}
                    onMouseDown={(e) => e.preventDefault()} onClickCapture={() => setActiveSavedView(v)}
                  >{v.name}</Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Selection</Label>
          <Inspector />
        </div>

        <div className="space-y-2">
          <Label>Scene IO</Label>
          <div className="flex gap-2">
            <Button onClick={exportJSON}>Export JSON</Button>
            <Button onClick={exportGLTF}>Export GLTF</Button>
          </div>
          <div className="flex items-center gap-2">
            <input type="file" accept=".json,application/json" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
          </div>
          <div className="flex gap-2">
            <Button onClick={clearAll} className="text-red-600 border-red-200">Clear</Button>
          </div>
        </div>

        <div className="mt-auto text-[10px] text-gray-400">Hotkeys: <kbd className="px-1 border rounded">g</kbd> translate • <kbd className="px-1 border rounded">r</kbd> rotate • <kbd className="px-1 border rounded">s</kbd> scale</div>
      </div>

      {/* Canvas area */}
      <div className="relative">
        <Canvas shadows camera={{ position: PRESET_VIEWS[presetViewKey]?.position || [5, 5, 5], fov: 50 }}>
          <color attach="background" args={[bg]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 7, 5]} intensity={0.9} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />

          <Suspense fallback={null}>
            <Grid args={[20, 20]} cellSize={0.5} sectionSize={2} sectionThickness={1.5} cellThickness={0.6} fadeDistance={20} position={[0, -0.001, 0]} />

            {items.map((it) => (
              <SelectableMesh key={it.id} item={it} selected={it.id === selectedId} onPointerDown={(id) => setSelectedId(id)} />
            ))}

            <GizmoWrapper />
            <SceneClicks />
            <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
            <CameraRig activeView={PRESET_VIEWS[presetViewKey]} />
          </Suspense>
        </Canvas>
        <div className="absolute top-3 right-3 flex gap-2">
          <IconButton onClick={exportJSON} title="Export JSON">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </IconButton>
          <IconButton onClick={exportGLTF} title="Export GLTF">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M20 21H4a2 2 0 0 1-2-2V8"/></svg>
          </IconButton>
        </div>
      </div>
    </div>
  );

  // Helper to jump to a saved view (stateful so the CameraRig lerp remains available)
  function setActiveSavedView(v) {
    // Instant jump, then you can still change preset dropdown to lerp presets
    setPresetViewKey("");
    // Imperatively set camera via a small helper component
    // We mount a transient component to set the camera once
    const node = document.createElement("div");
    document.body.appendChild(node);
  }
}
