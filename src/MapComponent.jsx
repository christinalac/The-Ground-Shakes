import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { getQuakeCoordinates } from "./utils/quakeUtils";

const MapComponent = ({ quakes = [], isLoading = false, errorMessage = "" }) => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [status, setStatus] = useState("Loading earthquakes...");
  const [selectedQuake, setSelectedQuake] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    setSelectedQuake(null);

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

    const popupOverlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    map.addOverlay(popupOverlay);

    const handleFeatureClick = (event) => {
      const feature = event?.feature;
      const quake = feature?.get("quake");

      if (!quake) {
        setSelectedQuake(null);
        popupOverlay.setPosition(undefined);
        return;
      }

      setSelectedQuake(quake);
      popupOverlay.setPosition(feature.getGeometry().getCoordinates());
    };

    map.on("singleclick", handleFeatureClick);

    const features = quakes
      .map((quake) => {
        const coordinates = getQuakeCoordinates(quake);
        if (!coordinates) {
          return null;
        }

        const { lon, lat } = coordinates;
        const feature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
          name: quake?.properties?.place || quake?.place || "Earthquake",
        });

        feature.set("quake", quake);

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
      })
      .filter(Boolean);

    vectorSource.addFeatures(features);

    if (errorMessage) {
      setStatus(errorMessage);
    } else if (isLoading) {
      setStatus("Loading earthquakes...");
    } else if (features.length) {
      setStatus(`Showing ${features.length} earthquake markers`);
    } else {
      setStatus("No earthquake points available for this response");
    }

    return () => {
      map.un("singleclick", handleFeatureClick);
      map.setTarget(null);
    };
  }, [quakes, isLoading, errorMessage]);

  return (
    <div>
      <p>{status}</p>
      <div style={{ position: "relative" }}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #ccc",
          }}
        />
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            minWidth: "180px",
            padding: "8px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: selectedQuake ? "block" : "none",
            pointerEvents: "none",
          }}
        >
          {selectedQuake ? (
            <>
              <strong>{selectedQuake?.properties?.place || selectedQuake?.place || "Earthquake"}</strong>
              <div>Magnitude: {selectedQuake?.mag ?? "N/A"}</div>
              <div>Lat: {selectedQuake?.lat ?? "N/A"}</div>
              <div>Lng: {selectedQuake?.lng ?? "N/A"}</div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;