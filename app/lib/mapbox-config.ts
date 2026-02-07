// Mapbox configuration and constants

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Dubai coordinates - centered on Business Bay
export const DUBAI_CENTER: [number, number] = [55.2708, 25.2048];

// Abu Dhabi coordinates - centered on Reem Island
export const ABU_DHABI_CENTER: [number, number] = [54.3773, 24.4539];

// Reem Island bounds for map constraints
export const REEM_ISLAND_BOUNDS: [[number, number], [number, number]] = [
  [54.3600, 24.4400], // Southwest
  [54.4000, 24.4700]  // Northeast
];

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

// Reem Island mock stops for Abu Dhabi integration
export const REEM_ISLAND_MOCK_STOPS = [
  {
    id: 'reem-1',
    coordinates: [54.3773, 24.4539],
    name: 'Reem Central Mall',
    name_ar: 'مول ريم المركزي',
    type: 'AC Shelter'
  },
  {
    id: 'reem-2',
    coordinates: [54.3850, 24.4580],
    name: 'Shams Abu Dhabi',
    name_ar: 'شمس أبوظبي',
    type: 'AC Shelter'
  },
  {
    id: 'reem-3',
    coordinates: [54.3700, 24.4500],
    name: 'Gate Towers',
    name_ar: 'أبراج البوابة',
    type: 'Covered'
  }
] as const;

// E11 Intercity Corridor Routes (Dubai <-> Abu Dhabi)
export const E11_ROUTES = {
  E100: {
    origin: 'Al Ghubaiba, Dubai',
    destination: 'Abu Dhabi Central',
    coordinates: [
      [55.2955, 25.2632], // Dubai start
      [55.1800, 25.1000], // Midpoint
      [54.3773, 24.4700]  // Abu Dhabi end
    ],
    color: '#14b8a6', // Teal
    duration: '~2 Hours'
  },
  E101: {
    origin: 'Ibn Battuta, Dubai',
    destination: 'Abu Dhabi Central',
    coordinates: [
      [55.1189, 25.0442], // Dubai start
      [54.8000, 24.7000], // Midpoint
      [54.3773, 24.4700]  // Abu Dhabi end
    ],
    color: '#f59e0b', // Amber
    duration: '~1.5 Hours'
  }
} as const;
