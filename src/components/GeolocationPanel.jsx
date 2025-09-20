"use client";
import { useState, useEffect } from "react";

export default function GeolocationPanel({ 
  selectedObject, 
  onLocationChange 
}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [isValidLocation, setIsValidLocation] = useState(true);

  // Update form when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setLatitude(selectedObject.latitude || 0);
      setLongitude(selectedObject.longitude || 0);
      setAltitude(selectedObject.altitude || 0);
    }
  }, [selectedObject]);

  // Validate coordinates
  const validateCoordinates = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const handleLatitudeChange = (value) => {
    const lat = parseFloat(value) || 0;
    setLatitude(lat);
    const valid = validateCoordinates(lat, longitude);
    setIsValidLocation(valid);
    
    if (valid && selectedObject) {
      onLocationChange(selectedObject.id, {
        latitude: lat,
        longitude: longitude,
        altitude: altitude
      });
    }
  };

  const handleLongitudeChange = (value) => {
    const lng = parseFloat(value) || 0;
    setLongitude(lng);
    const valid = validateCoordinates(latitude, lng);
    setIsValidLocation(valid);
    
    if (valid && selectedObject) {
      onLocationChange(selectedObject.id, {
        latitude: latitude,
        longitude: lng,
        altitude: altitude
      });
    }
  };

  const handleAltitudeChange = (value) => {
    const alt = parseFloat(value) || 0;
    setAltitude(alt);
    
    if (selectedObject) {
      onLocationChange(selectedObject.id, {
        latitude: latitude,
        longitude: longitude,
        altitude: alt
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const alt = position.coords.altitude || 0;
        
        setLatitude(lat);
        setLongitude(lng);
        setAltitude(alt);
        setIsValidLocation(true);
        
        if (selectedObject) {
          onLocationChange(selectedObject.id, {
            latitude: lat,
            longitude: lng,
            altitude: alt
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter coordinates manually.");
      }
    );
  };

  const setToDefaultLocation = () => {
    // Default to a common location (e.g., New York City)
    const defaultLat = 40.7128;
    const defaultLng = -74.0060;
    const defaultAlt = 0;
    
    setLatitude(defaultLat);
    setLongitude(defaultLng);
    setAltitude(defaultAlt);
    setIsValidLocation(true);
    
    if (selectedObject) {
      onLocationChange(selectedObject.id, {
        latitude: defaultLat,
        longitude: defaultLng,
        altitude: defaultAlt
      });
    }
  };

  if (!selectedObject) {
    return (
      <div style={{ 
        padding: "12px", 
        background: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
          Geolocation
        </h3>
        <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
          Select an object to set its location
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "12px", 
      background: "white", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
        Geolocation
      </h3>
      
      {/* Coordinate Inputs */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ marginBottom: "8px" }}>
          <label style={{ 
            display: "block", 
            fontSize: "12px", 
            fontWeight: "500", 
            marginBottom: "4px",
            color: isValidLocation ? "#333" : "#dc3545"
          }}>
            Latitude {!isValidLocation && "(Invalid)"}
          </label>
          <input
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => handleLatitudeChange(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: `1px solid ${isValidLocation ? "#ddd" : "#dc3545"}`,
              borderRadius: "4px",
              fontSize: "12px"
            }}
            placeholder="0.000000"
          />
        </div>
        
        <div style={{ marginBottom: "8px" }}>
          <label style={{ 
            display: "block", 
            fontSize: "12px", 
            fontWeight: "500", 
            marginBottom: "4px",
            color: isValidLocation ? "#333" : "#dc3545"
          }}>
            Longitude {!isValidLocation && "(Invalid)"}
          </label>
          <input
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            value={longitude}
            onChange={(e) => handleLongitudeChange(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: `1px solid ${isValidLocation ? "#ddd" : "#dc3545"}`,
              borderRadius: "4px",
              fontSize: "12px"
            }}
            placeholder="0.000000"
          />
        </div>
        
        <div style={{ marginBottom: "12px" }}>
          <label style={{ 
            display: "block", 
            fontSize: "12px", 
            fontWeight: "500", 
            marginBottom: "4px",
            color: "#333"
          }}>
            Altitude (meters)
          </label>
          <input
            type="number"
            step="0.1"
            value={altitude}
            onChange={(e) => handleAltitudeChange(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "12px"
            }}
            placeholder="0.0"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        <button
          onClick={getCurrentLocation}
          style={{
            flex: 1,
            padding: "6px 8px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500"
          }}
        >
          📍 Use My Location
        </button>
        <button
          onClick={setToDefaultLocation}
          style={{
            flex: 1,
            padding: "6px 8px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500"
          }}
        >
          🏙️ NYC Default
        </button>
      </div>

      {/* Location Display */}
      <div style={{ 
        padding: "8px", 
        background: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "11px",
        color: "#666"
      }}>
        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
          Current Location:
        </div>
        <div style={{ fontFamily: "monospace" }}>
          Lat: {latitude.toFixed(6)}°<br/>
          Lng: {longitude.toFixed(6)}°<br/>
          Alt: {altitude.toFixed(1)}m
        </div>
      </div>

      {/* Instructions */}
      <p style={{ 
        margin: "12px 0 0 0", 
        fontSize: "11px", 
        color: "#666",
        lineHeight: "1.4"
      }}>
        Set the real-world location for this object. 
        Use "My Location" to get your current coordinates.
      </p>
    </div>
  );
}
