import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type GeoJSONPointFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, unknown>;
};

type GeoJSONLineFeature = {
  type: "Feature";
  geometry: { type: "LineString"; coordinates: Array<[number, number]> };
  properties: Record<string, unknown>;
};

type FeatureCollection<TFeature> = {
  type: "FeatureCollection";
  features: TFeature[];
};

type BusGeoJSONResponse = {
  stops: FeatureCollection<GeoJSONPointFeature>;
  routes: FeatureCollection<GeoJSONLineFeature>;
  meta: {
    stops_count: number;
    routes_count: number;
    source_file: string;
  };
};

function parseCsvLine(line: string): Array<string | null> {
  const fields: Array<string | null> = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = line[i + 1];
        if (next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      const trimmed = current.trim();
      fields.push(trimmed === "null" || trimmed === "" ? null : trimmed);
      current = "";
      continue;
    }

    current += ch;
  }

  const trimmed = current.trim();
  fields.push(trimmed === "null" || trimmed === "" ? null : trimmed);
  return fields;
}

async function resolveCsvPath() {
  const candidates = [
    // If Next is started from app/
    path.resolve(process.cwd(), "../data/Public_Transportation_Routes_Stops.csv"),
    // If Next is started from repo root
    path.resolve(process.cwd(), "data/Public_Transportation_Routes_Stops.csv"),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }

  throw new Error("Public_Transportation_Routes_Stops.csv not found");
}

let cached: BusGeoJSONResponse | null = null;

async function buildBusGeoJSON(): Promise<BusGeoJSONResponse> {
  if (cached) return cached;

  const csvPath = await resolveCsvPath();
  const raw = await fs.readFile(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV appears empty");
  }

  const header = parseCsvLine(lines[0]).map((h) => (h ?? "").toString());
  const indexOf = (name: string) => header.indexOf(name);

  const idxTransportMode = indexOf("transport_mode");
  const idxRouteName = indexOf("route_name");
  const idxStopName = indexOf("stop_name");
  const idxStopId = indexOf("stop_id");
  const idxLng = indexOf("stop_location_longitude");
  const idxLat = indexOf("stop_location_latitude");
  const idxStopType = indexOf("bus_stop_type");

  const stopMap = new Map<
    string,
    {
      stop_id: string;
      stop_name: string;
      bus_stop_type: string | null;
      coordinates: [number, number];
      routes: Set<string>;
    }
  >();

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);

    const transportMode = idxTransportMode >= 0 ? row[idxTransportMode] : null;
    if (transportMode !== "Bus") continue;

    const stopId = (idxStopId >= 0 ? row[idxStopId] : null) ?? null;
    const stopName = (idxStopName >= 0 ? row[idxStopName] : null) ?? null;
    const lngStr = idxLng >= 0 ? row[idxLng] : null;
    const latStr = idxLat >= 0 ? row[idxLat] : null;

    if (!stopId || !stopName) continue;
    if (!lngStr || !latStr) continue;

    const lng = Number(lngStr);
    const lat = Number(latStr);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;

    const routeName = (idxRouteName >= 0 ? row[idxRouteName] : null) ?? "";

    const stopType = (idxStopType >= 0 ? row[idxStopType] : null) ?? null;

    const existingStop = stopMap.get(stopId);
    if (existingStop) {
      existingStop.routes.add(routeName);
    } else {
      stopMap.set(stopId, {
        stop_id: stopId,
        stop_name: stopName,
        bus_stop_type: stopType,
        coordinates: [lng, lat],
        routes: new Set([routeName]),
      });
    }

  }

  const stops: FeatureCollection<GeoJSONPointFeature> = {
    type: "FeatureCollection",
    features: Array.from(stopMap.values()).map((s) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: s.coordinates,
      },
      properties: {
        stop_id: s.stop_id,
        stop_name: s.stop_name,
        bus_stop_type: s.bus_stop_type,
        routes: Array.from(s.routes).filter(Boolean).slice(0, 25),
      },
    })),
  };

  const routes: FeatureCollection<GeoJSONLineFeature> = {
    type: "FeatureCollection",
    features: [],
  };

  cached = {
    stops,
    routes,
    meta: {
      stops_count: stops.features.length,
      routes_count: 0,
      source_file: path.basename(csvPath),
    },
  };

  return cached;
}

export async function GET() {
  try {
    const data = await buildBusGeoJSON();
    return NextResponse.json(data);
  } catch (error) {
    console.error("/api/transit/bus error:", error);
    return NextResponse.json(
      { error: "Failed to build bus GeoJSON" },
      { status: 500 }
    );
  }
}
