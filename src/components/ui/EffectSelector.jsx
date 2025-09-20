import React from "react";

const effects = [
  { label: "Metallic", value: "metallic" },
  { label: "Matte", value: "matte" },
  { label: "Reflective", value: "reflective" },
  { label: "Glossy", value: "glossy" },
  { label: "Transparent/Glass", value: "glass" },
  { label: "Textured", value: "textured" },
  { label: "Emissive/Glowing", value: "emissive" },
  { label: "Toon/Shaded", value: "toon" },
  { label: "Wireframe", value: "wireframe" },
  { label: "Bumpy/Normal Map", value: "bumpy" },
  { label: "Fresnel/Edge Highlight", value: "fresnel" },
  { label: "Holographic", value: "holographic" },
  { label: "Rough Concrete", value: "concrete" },
];

export default function EffectSelector({ objects, onEffectChange }) {
  return (
    <div style={{ marginTop: 20 }}>
      {objects.map((obj) => (
        <div key={obj.id} style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
            {obj.type} effect:
          </label>
          <select
            value={obj.effect || "matte"}
            onChange={e => onEffectChange(obj.id, e.target.value)}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: 'linear-gradient(90deg, #f8f8f8 0%, #eaeaea 100%)',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = '#888')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          >
            {effects.map((effect) => (
              <option key={effect.value} value={effect.value}>
                {effect.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
