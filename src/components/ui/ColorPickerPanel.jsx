import React from "react";

export default function ColorPickerPanel({ objects, onColorChange }) {
  return (
    <div style={{ marginTop: 20 }}>
      {objects.map((obj) => (
        <div key={obj.id} style={{ marginBottom: 10 }}>
          <label>
            {obj.type} color:
            <input
              type="color"
              value={obj.color}
              onChange={e => onColorChange(obj.id, e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
