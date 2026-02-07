"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MAPBOX_TOKEN,
  MAPBOX_CONFIG,
  HEATMAP_CONFIG,
  DUBAI_CENTER,
  ABU_DHABI_CENTER
} from "@/lib/mapbox-config";
import { StatsOverlay } from "./stats-overlay";
import { MaintenanceLayer } from "./maintenance-layer";
import { ControlPanel } from "./control-panel";

type FeatureCollection<TFeature> = {
  type: "FeatureCollection";
  features: TFeature[];
};

type BusStopFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    stop_id: string;
    stop_name: string;
    bus_stop_type?: string | null;
    routes?: string[];
  };
};

type BusGeoJSONResponse = {
  stops: FeatureCollection<BusStopFeature>;
  meta: {
    stops_count: number;
    routes_count: number;
    source_file: string;
  };
};

export function CommandCenterMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showDensity, setShowDensity] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [maintenanceVisible, setMaintenanceVisible] = useState(false);
  const [, setActiveCity] = useState<"dubai" | "abu-dhabi">("dubai");

  const handleMaintenanceToggle = (visible: boolean) => {
    setMaintenanceVisible(visible);
  };

  const handleCityChange = (city: "dubai" | "abu-dhabi") => {
    setActiveCity(city);
    if (map.current) {
      const newCenter = city === "dubai" ? DUBAI_CENTER : ABU_DHABI_CENTER;
      map.current.flyTo({
        center: newCenter,
        zoom: 11,
        duration: 2000,
        essential: true,
      });
    }
  };

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
      const addBusLayers = async () => {
        try {
          const response = await fetch("/api/transit/bus", { cache: "no-store" });
          if (!response.ok) throw new Error(`Failed to load bus data (${response.status})`);
          const data = (await response.json()) as BusGeoJSONResponse;

          if (!initializeMap.getSource("bus-stops")) {
            initializeMap.addSource("bus-stops", {
              type: "geojson",
              data: data.stops,
            });
          }

          if (!initializeMap.getLayer("bus-stops-layer")) {
            initializeMap.addLayer({
              id: "bus-stops-layer",
              type: "circle",
              source: "bus-stops",
              paint: {
                "circle-radius": 3,
                "circle-color": "#3b82f6",
                "circle-stroke-width": 1,
                "circle-stroke-color": "#ffffff",
                "circle-opacity": 0.9,
              },
            });
          }

          // Popup on stop click
          initializeMap.on("click", "bus-stops-layer", (e) => {
            const feature = e.features?.[0] as unknown as BusStopFeature | undefined;
            if (!feature) return;

            const coordinates = feature.geometry.coordinates.slice() as [number, number];
            const routes = (feature.properties.routes ?? []).slice(0, 8).join(", ");

            new mapboxgl.Popup({ offset: 16 })
              .setLngLat(coordinates)
              .setHTML(
                `<div class="p-2">
                  <h3 class="font-bold text-sm">${feature.properties.stop_name}</h3>
                  <p class="text-xs text-gray-600">Stop ID: ${feature.properties.stop_id}</p>
                  ${routes ? `<p class="text-xs mt-1"><span class="font-semibold">Routes:</span> ${routes}</p>` : ""}
                </div>`
              )
              .addTo(initializeMap);
          });

          initializeMap.on("mouseenter", "bus-stops-layer", () => {
            initializeMap.getCanvas().style.cursor = "pointer";
          });

          initializeMap.on("mouseleave", "bus-stops-layer", () => {
            initializeMap.getCanvas().style.cursor = "";
          });
        } catch (error) {
          console.error("Failed to add bus layers:", error);
        }
      };

      void addBusLayers();

      // Mock heatmap data source (would be from commuter_pings in production)
      initializeMap.addSource("commuter-density", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: Array.from({ length: 50 }, () => ({
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
        layout: { visibility: "visible" },
        paint: HEATMAP_CONFIG,
      });

      setMapLoaded(true);
    });

    map.current = initializeMap;

    return () => {
      initializeMap.remove();
    };
  }, []);

  // Update heatmap visibility
  useEffect(() => {
    if (mapLoaded && map.current && map.current.isStyleLoaded()) {
      const layer = map.current.getLayer("density-heatmap");
      if (layer) {
        map.current.setLayoutProperty(
          "density-heatmap",
          "visibility",
          showDensity ? "visible" : "none"
        );
      }
    }
  }, [showDensity, mapLoaded]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />

      <StatsOverlay />

      {/* Maintenance Layer */}
      <MaintenanceLayer mapInstance={map.current} visible={maintenanceVisible} />

      {/* Control Panel */}
      <ControlPanel
        onMaintenanceToggle={handleMaintenanceToggle}
        onCityChange={handleCityChange}
      />

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
