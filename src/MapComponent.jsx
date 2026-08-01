import { useEffect, useRef, useState } from "react";
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
import { useFavorites } from "./hooks/useFavorites";

const MapComponent = ({ quakes = [], isLoading = false, errorMessage = "" }) => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [status, setStatus] = useState("Loading earthquakes...");
  const [selectedQuake, setSelectedQuake] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

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

    // Overlay anchored to the clicked marker
    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: "bottom-left",
      offset: [12, -12],
      autoPan: true,
      autoPanAnimation: { duration: 250 },
      stopEvent: false,
    });
    map.addOverlay(popupOverlay);

    // Click a marker to show popup, click empty space to close
    const handleClick = (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
      const quake = feature?.get("quake");

      if (quake) {
        setSelectedQuake(quake);
        popupOverlay.setPosition(event.coordinate);
      } else {
        setSelectedQuake(null);
        popupOverlay.setPosition(undefined);
      }
    };

    // Change cursor when hovering over a marker
    const handlePointerMove = (event) => {
      const hit = map.hasFeatureAtPixel(event.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    };

    map.on("singleclick", handleClick);
    map.on("pointermove", handlePointerMove);

    const features = quakes
      .map((quake) => {
        const coordinates = getQuakeCoordinates(quake);
        if (!coordinates) return null;

        const { lon, lat } = coordinates;
        const feature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
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
      setStatus(`Showing ${features.length} earthquake markers — click a marker for details`);
    } else {
      setStatus("No earthquake points available for this response");
    }

    return () => {
      map.un("singleclick", handleClick);
      map.un("pointermove", handlePointerMove);
      map.setTarget(null);
    };
  }, [quakes, isLoading, errorMessage]);

  const quakeId = selectedQuake?._id || selectedQuake?.usgsId;
  const favorited = quakeId ? isFavorite(quakeId) : false;

  return (
    <div>
      <p>{status}</p>

      <div style={{ position: "relative" }}>
        {/* Map */}
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "500px",
            border: "1px solid #ccc",
          }}
        />

        {/* Popup anchored to the clicked marker */}
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            minWidth: "220px",
            padding: "12px 14px",
            background: "rgba(255,255,255,0.97)",
            border: "1px solid #aaa",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            fontSize: "13px",
            lineHeight: "1.7",
            display: selectedQuake ? "block" : "none",
            zIndex: 1000,
          }}
        >
          {selectedQuake && (
            <>
              {/* Header: place name + close button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <strong style={{ fontSize: "13px", maxWidth: "170px" }}>
                  {selectedQuake.properties?.place || selectedQuake.place || "Earthquake"}
                </strong>
                <button
                  onClick={() => setSelectedQuake(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#888", padding: "0", marginLeft: "8px" }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Details */}
              <div>
                <span style={{ color: "#555" }}>Magnitude:</span>{" "}
                <strong>{selectedQuake.magnitude ?? selectedQuake.properties?.mag ?? selectedQuake.mag ?? "N/A"}</strong>
              </div>
              <div><span style={{ color: "#555" }}>Lat:</span> {selectedQuake.lat ?? "N/A"}</div>
              <div><span style={{ color: "#555" }}>Lon:</span> {selectedQuake.lon ?? selectedQuake.lng ?? "N/A"}</div>
              {selectedQuake.depth != null && (
                <div><span style={{ color: "#555" }}>Depth:</span> {selectedQuake.depth} km</div>
              )}
              {selectedQuake.time && (
                <div><span style={{ color: "#555" }}>Time:</span> {new Date(selectedQuake.time).toLocaleString()}</div>
              )}
              {selectedQuake.url && (
                <div style={{ marginTop: "4px" }}>
                  <a href={selectedQuake.url} target="_blank" rel="noreferrer" style={{ color: "#1a73e8" }}>
                    USGS Details →
                  </a>
                </div>
              )}

              {/* Favorite checkbox */}
              <div style={{ marginTop: "8px", borderTop: "1px solid #ddd", paddingTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={favorited}
                    onChange={() => toggleFavorite(selectedQuake)}
                    style={{ width: "15px", height: "15px", cursor: "pointer" }}
                  />
                  <span>Favorite</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
