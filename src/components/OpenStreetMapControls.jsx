"use client";
import { useState } from "react";

export default function OpenStreetMapControls({ 
  onSettingsChange,
  settings = {
    centerLat: 40.7128,
    centerLng: -74.0060,
    zoom: 10,
    meshSize: 1000,
    heightScale: 1,
    mapType: 'osm'
  }
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handlePresetLocation = (lat, lng, name) => {
    const newSettings = { ...localSettings, centerLat: lat, centerLng: lng };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const presetLocations = [
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Moscow", lat: 55.7558, lng: 37.6176 }
  ];

  const mapTypes = [
    { value: 'osm', label: 'OpenStreetMap', description: 'Standard street map' },
    { value: 'terrain', label: 'Terrain', description: 'Topographic map' },
    { value: 'cycle', label: 'Cycle Map', description: 'Cycling routes' },
    { value: 'satellite', label: 'Satellite', description: 'Satellite imagery' }
  ];

  return (
    <div style={{ 
      padding: "12px", 
      background: "white", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0",
      minWidth: "280px"
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
        OpenStreetMap Terrain
      </h3>
      
      {/* Map Type Selection */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ 
          display: "block", 
          fontSize: "12px", 
          fontWeight: "500", 
          marginBottom: "4px" 
        }}>
          Map Type
        </label>
        <select
          value={localSettings.mapType}
          onChange={(e) => handleSettingChange('mapType', e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        >
          {mapTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {/* Location Presets */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ 
          display: "block", 
          fontSize: "12px", 
          fontWeight: "500", 
          marginBottom: "4px" 
        }}>
          Quick Locations
        </label>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "4px" 
        }}>
          {presetLocations.map((location) => (
            <button
              key={location.name}
              onClick={() => handlePresetLocation(location.lat, location.lng, location.name)}
              style={{
                padding: "4px 6px",
                background: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "10px",
                textAlign: "center"
              }}
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      {/* Center Coordinates */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ 
          display: "block", 
          fontSize: "12px", 
          fontWeight: "500", 
          marginBottom: "4px" 
        }}>
          Center Location
        </label>
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="number"
            step="0.000001"
            placeholder="Latitude"
            value={localSettings.centerLat}
            onChange={(e) => handleSettingChange('centerLat', parseFloat(e.target.value) || 0)}
            style={{
              flex: 1,
              padding: "6px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          />
          <input
            type="number"
            step="0.000001"
            placeholder="Longitude"
            value={localSettings.centerLng}
            onChange={(e) => handleSettingChange('centerLng', parseFloat(e.target.value) || 0)}
            style={{
              flex: 1,
              padding: "6px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          />
        </div>
      </div>

      {/* Zoom Level */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ 
          display: "block", 
          fontSize: "12px", 
          fontWeight: "500", 
          marginBottom: "4px" 
        }}>
          Zoom Level: {localSettings.zoom}
        </label>
        <input
          type="range"
          min="1"
          max="18"
          value={localSettings.zoom}
          onChange={(e) => handleSettingChange('zoom', parseInt(e.target.value))}
          style={{
            width: "100%",
            height: "4px",
            background: "#ddd",
            outline: "none",
            borderRadius: "2px"
          }}
        />
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          fontSize: "10px", 
          color: "#666",
          marginTop: "2px"
        }}>
          <span>1 (World)</span>
          <span>18 (Street)</span>
        </div>
      </div>

      {/* Mesh Size */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ 
          display: "block", 
          fontSize: "12px", 
          fontWeight: "500", 
          marginBottom: "4px" 
        }}>
          Mesh Size: {localSettings.meshSize}m
        </label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={localSettings.meshSize}
          onChange={(e) => handleSettingChange('meshSize', parseInt(e.target.value))}
          style={{
            width: "100%",
            height: "4px",
            background: "#ddd",
            outline: "none",
            borderRadius: "2px"
          }}
        />
      </div>

      {/* Height Scale */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ 
          display: "block", 
          fontSize: "12px", 
          fontWeight: "500", 
          marginBottom: "4px" 
        }}>
          Height Scale: {localSettings.heightScale}x
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={localSettings.heightScale}
          onChange={(e) => handleSettingChange('heightScale', parseFloat(e.target.value))}
          style={{
            width: "100%",
            height: "4px",
            background: "#ddd",
            outline: "none",
            borderRadius: "2px"
          }}
        />
      </div>

      {/* Current Settings Display */}
      <div style={{ 
        padding: "8px", 
        background: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "11px",
        color: "#666"
      }}>
        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
          Current Settings:
        </div>
        <div style={{ fontFamily: "monospace" }}>
          Lat: {localSettings.centerLat.toFixed(6)}°<br/>
          Lng: {localSettings.centerLng.toFixed(6)}°<br/>
          Zoom: {localSettings.zoom}<br/>
          Type: {mapTypes.find(t => t.value === localSettings.mapType)?.label}<br/>
          Size: {localSettings.meshSize}m<br/>
          Height: {localSettings.heightScale}x
        </div>
      </div>

      {/* Instructions */}
      <p style={{ 
        margin: "12px 0 0 0", 
        fontSize: "11px", 
        color: "#666",
        lineHeight: "1.4"
      }}>
        Uses OpenStreetMap tiles - free, open source, no API key required! 
        Higher zoom = more detail but slower loading.
      </p>
    </div>
  );
}
