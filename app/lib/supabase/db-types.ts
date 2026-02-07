// Database types for transit schema

export type StopType = 'Pole' | 'Flag' | 'Covered' | 'AC Shelter';

export interface Stop {
  id: string;
  stop_id: string;
  stop_name: string;
  stop_name_ar: string | null;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  stop_type: StopType | null;
  is_active: boolean;
  last_maintained: string | null;
  metadata: Record<string, any> | null;
}

export interface CommuterPing {
  id: string;
  device_id: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  accuracy_meters: number | null;
  ping_time: string;
}

export interface TransitHotspot {
  cluster_lat: number;
  cluster_lon: number;
  total_pings: number;
}

// GeoJSON types for Mapbox
export interface StopFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    stop_id: string;
    stop_name: string;
    stop_name_ar: string | null;
    stop_type: StopType | null;
    is_active: boolean;
    last_maintained: string | null;
    metadata: Record<string, any> | null;
  };
}

export interface StopCollection {
  type: 'FeatureCollection';
  features: StopFeature[];
}
