// Mapbox configuration and constants

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Dubai coordinates - centered on Business Bay
export const DUBAI_CENTER: [number, number] = [55.2708, 25.2048];

// Default map configuration
export const MAPBOX_CONFIG = {
  style: 'mapbox://styles/mapbox/dark-v11',
  center: DUBAI_CENTER,
  zoom: 11,
} as const;

// Stop marker colors
export const STOP_COLORS = {
  'AC Shelter': '#10b981', // Green for AC Shelters
  'Covered': '#10b981',
  'Pole': '#3b82f6', // Blue for Poles
  'Flag': '#3b82f6',
} as const;

// Heatmap configuration for commuter pings
export const HEATMAP_CONFIG = {
  'heatmap-weight': ['get', 'density_score'] as any,
  'heatmap-intensity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0, 1,
    11, 1.5,
  ] as any,
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0, 'rgba(236,222,239,0)',
    0.2, 'rgb(208,209,230)',
    0.4, 'rgb(166,189,219)',
    0.6, 'rgb(103,169,207)',
    0.8, 'rgb(28,144,153)',
    1, 'rgb(1,102,94)',
  ] as any,
  'heatmap-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0, 2,
    11, 20,
  ] as any,
} as const;
