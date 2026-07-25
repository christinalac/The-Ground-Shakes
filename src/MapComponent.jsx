import React, { useEffect, useRef } from "react";
import "ol/ol.css"; // OpenLayers default styles
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const MapComponent = () => {
  const mapRef = useRef(null); // Reference to the map container

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap tiles
        }),
      ],
      view: new View({
        center: [0, 0], // Coordinates in EPSG:3857 projection
        zoom: 2,
      }),
    });

    return () => map.setTarget(null); // Cleanup on unmount
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default MapComponent;