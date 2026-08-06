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

    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: "bottom-left",
      offset: [12, -12],
      autoPan: true,
      autoPanAnimation: { duration: 250 },
      stopEvent: false,
    });
    map.addOverlay(popupOverlay);

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
              fill: new Fill({ color: "#c0392b" }),
              stroke: new Stroke({ color: "#fdfdfd", width: 2 }),
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
    <div className="map-container">
      <p className="map-status">{status}</p>

      <div className="map-wrapper">
        <div ref={mapRef} className="map-view" />

        <div
          ref={popupRef}
          className={`quake-popup ${selectedQuake ? "quake-popup--visible" : ""}`}
        >
          {selectedQuake && (
            <>
              <div className="quake-popup-header">
                <strong className="quake-popup-title">
                  {selectedQuake.properties?.place ||
                    selectedQuake.place ||
                    "Earthquake"}
                </strong>
                <button
                  className="quake-popup-close"
                  onClick={() => setSelectedQuake(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="quake-popup-details">
                <div>
                  <span className="quake-popup-label">Magnitude:</span>{" "}
                  <strong>
                    {selectedQuake.magnitude ??
                      selectedQuake.properties?.mag ??
                      selectedQuake.mag ??
                      "N/A"}
                  </strong>
                </div>
                <div>
                  <span className="quake-popup-label">Lat:</span>{" "}
                  {selectedQuake.lat ?? "N/A"}
                </div>
                <div>
                  <span className="quake-popup-label">Lon:</span>{" "}
                  {selectedQuake.lon ?? selectedQuake.lng ?? "N/A"}
                </div>
                {selectedQuake.depth != null && (
                  <div>
                    <span className="quake-popup-label">Depth:</span>{" "}
                    {selectedQuake.depth} km
                  </div>
                )}
                {selectedQuake.time && (
                  <div>
                    <span className="quake-popup-label">Time:</span>{" "}
                    {new Date(selectedQuake.time).toLocaleString()}
                  </div>
                )}
                {selectedQuake.url && (
                  <div className="quake-popup-link-wrapper">
                    <a
                      href={selectedQuake.url}
                      target="_blank"
                      rel="noreferrer"
                      className="quake-popup-link"
                    >
                      USGS Details →
                    </a>
                  </div>
                )}
              </div>

              <div className="quake-popup-favorite">
                <label className="quake-popup-favorite-label">
                  <input
                    type="checkbox"
                    checked={favorited}
                    onChange={() => toggleFavorite(selectedQuake)}
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
