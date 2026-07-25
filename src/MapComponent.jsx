import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const MapComponent = ({ quakes = [] }) => {
  const mapRef = useRef(null);
  const [status, setStatus] = useState("Loading earthquakes...");

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const features = quakes
      .filter((quake) => {
        const coords = quake?.geometry?.coordinates || quake?.coordinates;
        return (Array.isArray(coords) && coords.length >= 2)
          || (typeof quake?.lng === 'number' && typeof quake?.lat === 'number');
      })
      .map((quake) => {
        const coords = quake?.geometry?.coordinates || quake?.coordinates;
        const lon = Array.isArray(coords) ? coords[0] : quake?.lng;
        const lat = Array.isArray(coords) ? coords[1] : quake?.lat;
        const feature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
          name: quake?.properties?.place || quake?.place || "Earthquake",
        });

        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({ color: "red" }),
              stroke: new Stroke({ color: "white", width: 2 }),
            }),
          })
        );

        return feature;
      });

    vectorSource.addFeatures(features);

    if (features.length) {
      setStatus(`Showing ${features.length} earthquake markers`);
    } else {
      setStatus("No earthquake points available for this response");
    }

    return () => map.setTarget(null);
  }, [quakes]);

  return (
    <div>
      <p>{status}</p>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "400px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default MapComponent;