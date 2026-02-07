"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { getMaintenanceAlerts, MaintenanceAlert } from "@/lib/supabase/queries";

interface MaintenanceLayerProps {
  mapInstance: mapboxgl.Map | null;
  visible: boolean;
}

export function MaintenanceLayer({ mapInstance, visible }: MaintenanceLayerProps) {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceAlert | null>(null);

  useEffect(() => {
    if (visible) {
      loadMaintenanceAlerts();
    }
  }, [visible]);

  const loadMaintenanceAlerts = async () => {
    const data = await getMaintenanceAlerts();
    setAlerts(data);

    if (mapInstance && data.length > 0) {
      addMaintenanceMarkersToMap(data);
    }
  };

  const addMaintenanceMarkersToMap = (alertData: MaintenanceAlert[]) => {
    if (!mapInstance) return;

    // Remove existing markers if any
    const existingSource = mapInstance.getSource("maintenance-alerts");
    if (existingSource) {
      if (mapInstance.getLayer("maintenance-alerts-layer")) {
        mapInstance.removeLayer("maintenance-alerts-layer");
      }
      mapInstance.removeSource("maintenance-alerts");
    }

    // Create GeoJSON from alerts
    const geojson = {
      type: "FeatureCollection" as const,
      features: alertData.map((alert) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: extractCoordinates(alert.location),
        },
        properties: {
          stopId: alert.stop_id,
          stopName: alert.stop_name,
          stopNameAr: alert.stop_name_ar,
          stopType: alert.stop_type,
          internalTemp: alert.metadata?.internal_temp || 0,
        },
      })),
    };

    // Add source
    mapInstance.addSource("maintenance-alerts", {
      type: "geojson",
      data: geojson,
    });

    // Add layer
    mapInstance.addLayer({
      id: "maintenance-alerts-layer",
      type: "circle",
      source: "maintenance-alerts",
      paint: {
        "circle-radius": 14,
        "circle-color": "#ef4444",
        "circle-stroke-width": 3,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": 0.9,
      },
    });

    // Add click handler
    mapInstance.on("click", "maintenance-alerts-layer", (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const matchingAlert = alertData.find(
          (a) => a.stop_id === feature.properties?.stopId
        );
        if (matchingAlert) {
          setSelectedAlert(matchingAlert);
        }
      }
    });

    // Change cursor on hover
    mapInstance.on("mouseenter", "maintenance-alerts-layer", () => {
      if (mapInstance) mapInstance.getCanvas().style.cursor = "pointer";
    });

    mapInstance.on("mouseleave", "maintenance-alerts-layer", () => {
      if (mapInstance) mapInstance.getCanvas().style.cursor = "";
    });
  };

  const extractCoordinates = (location: any): [number, number] => {
    if (typeof location === "string") {
      // Parse WKT format: "POINT(lon lat)"
      const matches = location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
      if (matches) {
        return [parseFloat(matches[1]), parseFloat(matches[2])];
      }
    }
    return [0, 0];
  };

  useEffect(() => {
    if (!visible && mapInstance) {
      // Remove layer when not visible
      if (mapInstance.getLayer("maintenance-alerts-layer")) {
        mapInstance.removeLayer("maintenance-alerts-layer");
      }
      if (mapInstance.getSource("maintenance-alerts")) {
        mapInstance.removeSource("maintenance-alerts");
      }
    }
  }, [visible, mapInstance]);

  return (
    <AnimatePresence>
      {selectedAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-32 z-30 w-96"
        >
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500/40 blur-md"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      <span>⚠️ AC FAILURE</span>
                    </h3>
                    <p className="text-sm text-white/70">
                      <span>{selectedAlert.stop_name}</span>
                    </p>
                    {selectedAlert.stop_name_ar && (
                      <p className="text-sm text-white/50 mt-1" dir="rtl">
                        <span>{selectedAlert.stop_name_ar}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <span>✕</span>
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      <span>Internal Temperature</span>
                    </span>
                    <span className="text-lg font-bold text-red-400">
                      {selectedAlert.metadata?.internal_temp}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      <span>Shelter Type</span>
                    </span>
                    <span className="text-sm text-white">
                      <span>{selectedAlert.stop_type}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      <span>Status</span>
                    </span>
                    <span className="text-sm text-red-400">
                      <span>Requires Maintenance</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/40">
                  <span>
                    This shelter has exceeded the maximum operating temperature
                    threshold of 30°C and requires immediate maintenance.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
