"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN, MAPBOX_CONFIG, STOP_COLORS, HEATMAP_CONFIG } from "@/lib/mapbox-config";
import { StopFeature } from "@/lib/supabase/db-types";
import { StatsOverlay } from "./stats-overlay";

// Mock stops data for demonstration
const MOCK_STOPS: StopFeature[] = [
  {
    type: "Feature",
    geometry: { type: "Point", coordinates: [55.2708, 25.2048] },
    properties: {
      id: "1",
      stop_id: "BB001",
      stop_name: "Business Bay Metro",
      stop_name_ar: "محطة مترو الخليج التجاري",
      stop_type: "AC Shelter",
      is_active: true,
      last_maintained: null,
      metadata: null,
    },
  },
  {
    type: "Feature",
    geometry: { type: "Point", coordinates: [55.2758, 25.2098] },
    properties: {
      id: "2",
      stop_id: "BB002",
      stop_name: "Bay Avenue",
      stop_name_ar: "شارع الخليج",
      stop_type: "Pole",
      is_active: true,
      last_maintained: null,
      metadata: null,
    },
  },
  {
    type: "Feature",
    geometry: { type: "Point", coordinates: [55.2658, 25.2008] },
    properties: {
      id: "3",
      stop_id: "BB003",
      stop_name: "Business Tower",
      stop_name_ar: "برج الأعمال",
      stop_type: "AC Shelter",
      is_active: true,
      last_maintained: null,
      metadata: null,
    },
  },
];

export function CommandCenterMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showDensity, setShowDensity] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initializeMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: MAPBOX_CONFIG.center,
      zoom: MAPBOX_CONFIG.zoom,
    });

    initializeMap.on("load", () => {
      // Add stop markers
      MOCK_STOPS.forEach((stop) => {
        const stopType = stop.properties.stop_type || "Pole";
        const color = STOP_COLORS[stopType] || "#3b82f6";

        // Create marker
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundColor = color;
        el.style.width = "14px";
        el.style.height = "14px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        el.style.cursor = "pointer";

        new mapboxgl.Marker(el)
          .setLngLat(stop.geometry.coordinates as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-bold text-sm">${stop.properties.stop_name}</h3>
                <p class="text-xs text-gray-600">${stop.properties.stop_name_ar}</p>
                <p class="text-xs mt-1"><span class="font-semibold">Type:</span> ${stopType}</p>
              </div>`
            )
          )
          .addTo(initializeMap);
      });

      // Mock heatmap data source (would be from commuter_pings in production)
      initializeMap.addSource("commuter-density", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: Array.from({ length: 50 }, (_, i) => ({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [
                55.2708 + (Math.random() - 0.5) * 0.05,
                25.2048 + (Math.random() - 0.5) * 0.05,
              ],
            },
            properties: {
              density_score: Math.random(),
            },
          })),
        },
      });

      // Add heatmap layer
      initializeMap.addLayer({
        id: "density-heatmap",
        type: "heatmap",
        source: "commuter-density",
        layout: { visibility: showDensity ? "visible" : "none" },
        paint: HEATMAP_CONFIG,
      });
    });

    map.current = initializeMap;

    return () => {
      initializeMap.remove();
    };
  }, []);

  // Update heatmap visibility
  useEffect(() => {
    if (map.current && map.current.getLayer("density-heatmap")) {
      map.current.setLayoutProperty(
        "density-heatmap",
        "visibility",
        showDensity ? "visible" : "none"
      );
    }
  }, [showDensity]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />

      <StatsOverlay />

      {/* Map controls */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-lg p-4 rounded-xl border border-slate-700 shadow-2xl">
        <h3 className="text-sm font-bold text-teal-400 mb-3">Map Layers</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Commuter Heatmap
          </span>
          <button
            onClick={() => setShowDensity(!showDensity)}
            className={`ml-4 w-12 h-6 rounded-full transition-colors ${
              showDensity ? "bg-teal-500" : "bg-slate-600"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                showDensity ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
