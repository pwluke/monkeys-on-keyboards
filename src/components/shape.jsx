import { useRef } from "react";

export default function Shape({ type, position, color, effect }) {
    // Compute effect-driven material settings
    let materialProps = {};
    switch (effect) {
      case "metallic":
        materialProps = { metalness: 1, roughness: 0.2 };
        break;
      case "matte":
        materialProps = { metalness: 0, roughness: 1 };
        break;
      case "reflective":
        materialProps = { metalness: 1, roughness: 0, envMapIntensity: 2 };
        break;
      case "glossy":
        materialProps = { metalness: 0.8, roughness: 0.1 };
        break;
      case "glass":
        materialProps = { metalness: 0.25, roughness: 0, opacity: 0.3, transparent: true };
        break;
      case "textured":
        // Placeholder for a real texture: add map/normalMap here when available
        materialProps = { metalness: 0.2, roughness: 0.7 };
        break;
      case "emissive":
        materialProps = { metalness: 0.1, roughness: 0.5, emissive: "yellow", emissiveIntensity: 1 };
        break;
      case "toon":
        // Would swap to MeshToonMaterial for a true toon effect
        materialProps = { metalness: 0, roughness: 0.8 };
        break;
      case "wireframe":
        materialProps = { metalness: 0, roughness: 0.5, wireframe: true };
        break;
      case "bumpy":
        // Would attach a normalMap for real bumpiness
        materialProps = { metalness: 0.3, roughness: 0.7 };
        break;
      case "fresnel":
        // True fresnel would need a custom shader
        materialProps = { metalness: 0.2, roughness: 0.5 };
        break;
      case "holographic":
        materialProps = { metalness: 1, roughness: 0, envMapIntensity: 2, opacity: 0.7, transparent: true, color: "#00ffff" };
        break;
      case "concrete":
        materialProps = { metalness: 0, roughness: 1, color: "#888" };
        break;
      default:
        materialProps = { metalness: 0, roughness: 0.5 };
    }
  
    const meshRef = useRef();
  
    // Default color per shape if none provided
    const defaultColorByType = { box: "red", cone: "blue", sphere: "green" };
    const finalColor = color || defaultColorByType[type] || "white";
  
    switch (type) {
      case "box":
        return (
          <mesh ref={meshRef} position={position}>
            <boxGeometry />
            <meshStandardMaterial color={finalColor} {...materialProps} />
          </mesh>
        );
      case "cone":
        return (
          <mesh ref={meshRef} position={position}>
            <coneGeometry />
            <meshStandardMaterial color={finalColor} {...materialProps} />
          </mesh>
        );
      case "sphere":
        return (
          <mesh ref={meshRef} position={position}>
            <sphereGeometry />
            <meshStandardMaterial color={finalColor} {...materialProps} />
          </mesh>
        );
      default:
        return null;
    }
  }