Technical Blueprint for the UAE Transit Navigator: A Data-Driven Framework for Urban Infrastructure Planning in Dubai and Abu Dhabi
The rapid urbanization of the United Arab Emirates necessitates a transition from traditional transit management to a highly integrated, data-driven intelligence model. This report delineates the technical architecture and strategic implementation of a specialized urban planning application designed to optimize bus routing and infrastructure placement within the unique geographical and socio-economic landscape of Dubai and Abu Dhabi. By leveraging a modern technical stack—comprising Next.js, Supabase, and Mapbox—and integrating cutting-edge localization via Lingo.dev, this framework provides urban planners with the tools required to address the high-density requirements of districts like Business Bay and the rapid expansion of Reem Island.
Multilingual Integration and Lingo.dev Architecture
The demography of the United Arab Emirates is characterized by a diverse, multilingual population, making internationalization a core requirement rather than an ancillary feature. Implementing Lingo.dev provides a build-time transformation mechanism that ensures the application remains performant while supporting the seamless transition between Arabic and English, which is essential for local government stakeholders and the broader public.

TypeScript


// next.config.ts configuration for Lingo.dev integration
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['supabase.com', 'mapbox.com'],
  },
};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["ar"], // Strategic priority for UAE regional support
  });
}


The @lingo.dev/compiler operates by analyzing the Abstract Syntax Tree (AST) of the React application during the build phase. Unlike traditional runtime libraries such as i18next, which incur a performance penalty by loading translation files in the browser, the Lingo compiler transforms JSX nodes directly into localized outputs.1 This is particularly advantageous for React Server Components (RSC), as the translated content is embedded in the server-side rendering output, resulting in zero additional client-side JavaScript for internationalization.2 For a high-stakes hackathon, this minimizes bundle size and maximizes the Lighthouse performance score, a critical metric for production-grade prototypes.
The implementation requires a centralized provider in the root layout to handle the localized context.

TypeScript


// app/layout.tsx
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LingoProvider>
      <html lang="en">
        <body className="antialiased bg-slate-50">
          {children}
        </body>
      </html>
    </LingoProvider>
  );
}


The compiler identifies translatable content within text nodes, string attributes (such as image alt tags), and template expressions.1 To support dynamic language switching within the "Command Center" dashboard, a client-side switcher is implemented using the useLocale and setLocale hooks provided by the package.

TypeScript


"use client";
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
      <span className="text-sm font-medium text-slate-600">Language:</span>
      <select 
        value={locale} 
        onChange={(e) => setLocale(e.target.value)}
        className="text-sm border-none focus:ring-0 cursor-pointer"
      >
        <option value="en">English (EN)</option>
        <option value="ar">العربية (AR)</option>
      </select>
    </div>
  );
}


In the development environment, the compiler utilizes a pseudotranslator by default, which generates instant fake translations to visualize which components are properly localized without incurring API costs.1 During the CI/CD phase, the Lingo CLI can be integrated with GitHub Actions to pull the latest verified translations from the cloud before the final build, ensuring that the production environment is always synchronized with the translation memory.3
Backend Infrastructure and Geospatial Data Modeling
The backend of the transit navigator relies on Supabase and its underlying PostgreSQL engine, specifically augmented by the PostGIS extension for spatial analysis. In the UAE context, managing transit data requires a sophisticated approach to handle both the static General Transit Feed Specification (GTFS) data from the Dubai Roads and Transport Authority (RTA) and dynamic commuter movement data.
PostGIS Extension and Spatial Tables
The first step in establishing the database architecture is the enablement of PostGIS within a dedicated schema to prevent conflicts and maintain high computational efficiency.5

SQL


-- Enable PostGIS in a dedicated schema
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- Table for Bus Stop Infrastructure
CREATE TABLE public.stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id text UNIQUE NOT NULL,
  stop_name text NOT NULL,
  stop_name_ar text,
  location extensions.geography(POINT, 4326) NOT NULL,
  stop_type text CHECK (stop_type IN ('Pole', 'Flag', 'Covered', 'AC Shelter')),
  is_active boolean DEFAULT true,
  last_maintained timestamptz,
  metadata jsonb -- For storing facility details like CCTV or card recharge units
);

-- Table for Commuter Movement Pings (Hotspot Analysis)
CREATE TABLE public.commuter_pings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL,
  location extensions.geography(POINT, 4326) NOT NULL,
  accuracy_meters float,
  ping_time timestamptz DEFAULT now()
);

-- Spatial indexing for high-performance geo-queries
CREATE INDEX stops_location_idx ON public.stops USING GIST (location);
CREATE INDEX commuter_pings_location_idx ON public.commuter_pings USING GIST (location);


The use of the geography type over the geometry type is essential for UAE-wide applications, as it handles coordinates in latitude and longitude while accurately calculating distances over the earth's curved surface.6 For urban planners, identifying "hotspots" involves aggregating these pings to find clusters of high demand that are currently underserved by existing infrastructure.
Row Level Security (RLS) and Data Governance
Given the sensitive nature of movement data, strict RLS policies must be enforced. This ensures that while public transit stop locations are accessible to all users, individual commuter pings are protected.7

SQL


-- Enable RLS on core tables
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commuter_pings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to bus stop locations
CREATE POLICY "Allow public read of stops" 
ON public.stops FOR SELECT 
TO anon, authenticated 
USING (true);

-- Policy: Restrict ping access to internal service roles
CREATE POLICY "Restrict pings to service role" 
ON public.commuter_pings FOR ALL 
TO service_role 
USING (true);

-- Policy: Allow users to view their own transit history (if logged in)
CREATE POLICY "Users view own history" 
ON public.commuter_pings FOR SELECT 
TO authenticated 
USING (auth.uid() = device_id);


Data Sourcing and Integration Strategy
The efficacy of the application depends on the successful ingestion of data from regional authorities. Dubai's RTA provides comprehensive GTFS and GeoJSON datasets via the Dubai Pulse platform, which include routes, stops, and real-time ridership statistics.8

Data Entity
Source Platform
Format
Application Use
Bus Routes
Dubai Pulse / RTA
GeoJSON / CSV
Map visualization of active lines 8
Bus Stop Details
Dubai Pulse
CSV / API
Infrastructure inventory (AC vs. Pole) 8
GTFS Feed
RTA Open Data
.7z / API
Real-time scheduling and ETA 9
Population Density
WorldPop / Meta
GeoTIFF
Demand modeling and "hotspot" overlap 10
AC Shelter Status
Abu Dhabi ITC / Darbi
GIS Layer
Maintenance planning for Abu Dhabi 12

For Abu Dhabi, the Integrated Transport Centre (ITC) manages the "Darbi" ecosystem. While direct bulk downloads are more restricted, spatial data can be accessed through the TAMM portal or via specialized GIS layers representing bus shelter locations, which include specific metadata on whether the stop is a standard pole or an air-conditioned unit.12
Spatial Analysis and "Hotspot" Detection Logic
To fulfill the core responsibility of suggesting new bus stops, the application must process large volumes of commuter_pings and compare them against existing stops. This is achieved using spatial clustering and distance-based filtering.
Underserved Area Calculation
A "hotspot" is defined as a geographic cluster of high commuter density that falls outside the service radius of any existing bus stop. Using PostGIS, we can define a database function that identifies these areas.

SQL


CREATE OR REPLACE FUNCTION find_transit_hotspots(search_radius_meters float, min_ping_count int)
RETURNS TABLE (cluster_lat float, cluster_lon float, total_pings bigint) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH clusters AS (
    -- Cluster pings using DBSCAN or a simpler grid-based approach
    SELECT 
      extensions.ST_SnapToGrid(location::extensions.geometry, 0.001) as grid_cell,
      count(*) as ping_count
    FROM public.commuter_pings
    GROUP BY grid_cell
  )
  SELECT 
    extensions.ST_Y(grid_cell) as cluster_lat,
    extensions.ST_X(grid_cell) as cluster_lon,
    ping_count
  FROM clusters c
  -- Filter out clusters that are already near an existing stop
  WHERE NOT EXISTS (
    SELECT 1 FROM public.stops s
    WHERE extensions.ST_DWithin(c.grid_cell::extensions.geography, s.location, search_radius_meters)
  )
  AND ping_count >= min_ping_count
  ORDER BY ping_count DESC;
END;
$$;


This logic utilizes the ST_DWithin function, which is highly optimized for spatial indices.6 For a hackathon MVP, using a grid-based snapping approach (ST_SnapToGrid) is more computationally efficient than a full DBSCAN clustering algorithm. The distance calculation follows the standard Haversine formula internally, which can be represented mathematically for manual verification:

Where:
 is the earth radius (6,371 km).
 are latitudes in radians.
 are longitudes in radians.
UI/UX Design: The Urban Planning "Command Center"
The frontend is built using Next.js (App Router) to ensure high performance through server-side rendering and efficient client-side navigation. The "Command Center" dashboard must provide urban planners with a multi-layered view of the city.
Map Layer Toggle Logic
The integration of Mapbox GL JS allows for the rendering of complex GeoJSON datasets. The dashboard uses a layer toggle system where planners can overlay current bus lines with population density heatmaps to identify spatial correlations.

TypeScript


"use client";
import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CommandCenterMap = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const = useState(true);
  const = useState(true);

  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [55.2708, 25.2048], // Centered on Dubai
      zoom: 11,
    });

    initializeMap.on('load', () => {
      // Add Population Density Source
      initializeMap.addSource('population-density', {
        type: 'geojson',
        data: '/api/geo/density' // Dynamic endpoint for population data
      });

      // Add Bus Routes Source
      initializeMap.addSource('bus-routes', {
        type: 'geojson',
        data: '/api/geo/routes'
      });

      // Add Heatmap Layer for Density
      initializeMap.addLayer({
        id: 'density-layer',
        type: 'heatmap',
        source: 'population-density',
        layout: { visibility: 'visible' },
        paint: {
          'heatmap-weight': ['get', 'density_score'],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            1, 'rgb(1,102,94)'
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom']
        }
      });

      setMap(initializeMap);
    });

    return () => initializeMap.remove();
  },);

  const toggleLayer = (layerId: string, state: boolean, setter: (val: boolean) => void) => {
    if (map) {
      map.setLayoutProperty(layerId, 'visibility', state? 'none' : 'visible');
      setter(!state);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div id="map-container" className="h-full w-full" />
      
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-slate-200 w-80">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Command Center</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Population Heatmap</span>
            <button 
              onClick={() => toggleLayer('density-layer', showDensity, setShowDensity)}
              className={`w-12 h-6 rounded-full transition-colors ${showDensity? 'bg-teal-500' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showDensity? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          {/* Stats Summary */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-teal-50 rounded-lg text-center">
                <p className="text-xs text-teal-600 font-bold uppercase">Active Routes</p>
                <p className="text-lg font-black text-teal-900">142</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <p className="text-xs text-amber-600 font-bold uppercase">Hotspots</p>
                <p className="text-lg font-black text-amber-900">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


Motion and Interaction with Framer Motion
To enhance the "premium" feel of the dashboard, Framer Motion is utilized for entrance animations of statistics cards and the smoothing of sidebar transitions. In a high-stakes hackathon, these micro-interactions demonstrate a level of polish that distinguishes a winning project from a basic prototype.

TypeScript


import { motion } from 'framer-motion';

const StatCard = ({ title, value }: { title: string, value: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-4 bg-white rounded-lg shadow-sm border border-slate-100"
  >
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-black text-slate-800">{value}</p>
  </motion.div>
);


UAE Geographic Context and Strategic Infrastructure
The application must be deeply rooted in the specific urban dynamics of the UAE. Two primary districts serve as the "ground truth" for the transit model: Business Bay in Dubai and Reem Island in Abu Dhabi.
Business Bay: Congestion and Pedestrian Hotspots
Business Bay is one of Dubai's most congested districts, characterized by a mix of high-rise commercial and residential towers.14 The RTA has recently completed significant traffic improvements here, including the conversion of two-way streets into one-way dual roadways to increase capacity by 100%.15 For our transit app, the focus in Business Bay is on "last-mile" connectivity.
Hotspot Analysis: Commuter density data typically peaks near the Al Khail Road and Sheikh Zayed Road intersections. The app should suggest "feeder" routes that connect the Business Bay Metro station to the various clusters of towers (e.g., the Al Mustaqbal Street corridor).14
Infrastructure Need: High pedestrian volumes near the canal bridge require optimized stop placements that reduce traffic overlap and conflict points.17
Reem Island: Planning for Managed Growth
Reem Island represents Abu Dhabi's path toward sustainable urban growth, with a projected population of over 210,000 residents.18 The Integrated Concept Master Plan (ICMP) emphasizes high-quality community facilities, including 11 private schools and three hospitals.18
Data Strategy: The app uses the "Gross Floor Area" (GFA) distribution from the ICMP to predict transit demand. Planners can toggle the "Future Development" layer to see where the 20 million  of planned GFA will create new commuter hubs.18
Smart Mobility: Reem Island is a candidate for "Abu Dhabi Link," an on-demand bus service.19 The backend architecture supports this by allowing for "corner-to-corner" ride requests integrated into the routing engine.20
The E11 Corridor: Intercity Syncing
The E11 highway (Sheikh Zayed Road) is the lifeblood of inter-emirate transit. The RTA operates several critical intercity lines, notably the E100 and E101.21

Route
Origin
Destination
Duration
Key Intermediate Stops
E100
Al Ghubaiba (Dubai)
Abu Dhabi Central
~2 Hours
Al Jafiliya 21
E101
Ibn Battuta (Dubai)
Abu Dhabi Central
~1.5 Hours
Samha, Shahama 22
E102
Jafliya / Ibn Battuta
Musafah / AD Airport
~1.75 Hours
Abu Dhabi Airport 24

For these intercity routes, the planning dashboard must visualize "dwell times" and "bus bunching" along the E11. High-accuracy Estimated Time of Arrival (ETA) is achieved by merging operator telematics with smartphone probe data through hybrid machine learning.26
The "Air-Conditioned Shelter" Challenge
A unique requirement for UAE transit is the provision of climate-controlled environments for commuters. Abu Dhabi’s Department of Transport has established a project to deploy 600 air-conditioned bus shelters across the emirate.27
Mapping Infrastructure: The application must distinguish between shelter types. AC shelters are crucial for high-traffic zones such as Airport Road (Sheikh Rashid Bin Saeed Street) and Muroor Road (Sultan Bin Zayed the First Street).27
Maintenance Telemetry: Using the Supabase metadata JSONB field, we can track the health of these shelters. If a shelter's internal temperature exceeds , the "Command Center" dashboard flags it for urgent maintenance.28
Capacity Planning: Larger shelters (e.g., 12 meters in length) can accommodate up to 30 people.27 The app calculates whether existing shelter capacity meets the "peak load" identified by the commuter pings.
Hackathon Execution: The MVP and Time Traps
In a high-stakes hackathon environment, the goal is to deliver a functional, high-impact prototype within 48–72 hours. Proactivity in identifying "time traps" is as important as the code itself.
The Minimum Viable Product (MVP)
A winning MVP focuses on the "Red Routes"—the core user journeys that provide the most value.30
Data Ingestion Layer: A pipeline that pulls static GeoJSON from Dubai Pulse and Abu Dhabi ITC.
Visualization Dashboard: A Mapbox interface with at least two togglable layers (Population vs. Current Stops).
The "Gap" Indicator: A visual highlight of areas with high density but no bus stops (the "Hotspot").
Localized UI: A bilingual (AR/EN) interface using the Lingo.dev compiler to demonstrate market readiness.
Hackathon Time Traps to Avoid

Potential Feature
Why it's a Trap
The MVP Solution
Real-time GPS Tracking
Requires constant socket connections and high server load for hundreds of buses.31
Use "Mocked Real-time" where markers move along paths based on static schedule data.
Seat Booking / Payments
Involves complex financial integrations, PCI compliance, and Hafilat/Nol API hurdles.31
Build a "Booking UI" prototype that simulates the user flow without actual transactions.
Full 3D Urban Modeling
Rendering 3D buildings for all of Dubai and Abu Dhabi will lag on most devices.
Use Mapbox's standard 3D layer at specific zoom levels only for Business Bay.32
Manual Data Cleaning
Spending 12 hours cleaning CSV files will leave no time for the frontend.
Use ogr2ogr to bulk-import GeoJSON into PostGIS directly.5

High-Energy Development Milestones
Hour 1-4: Initialize Next.js, Supabase, and Lingo.dev. Enable PostGIS.
Hour 5-12: Ingest data from Dubai Pulse. Establish the stops and routes tables.
Hour 13-24: Develop the Mapbox dashboard. Implement the "hotspot" SQL function.
Hour 25-36: Design the UI with Tailwind and Framer Motion. Add the AR/EN switcher.
Hour 37-48: Polishing, performance optimization, and pitch deck preparation.
The transition to a smarter, more responsive transit system in the UAE is not merely a technological challenge but an urban planning imperative. By combining the agility of the Next.js/Supabase stack with the regional intelligence of local geospatial data, this application provides a scalable blueprint for future-ready mobility. The focus on air-conditioned infrastructure, intercity E11 dynamics, and high-growth areas like Reem Island ensures that the solution is uniquely tailored to the Emirates. Success in the hackathon depends on maintaining a high-energy, iterative approach while avoiding the pitfalls of over-engineering, ultimately delivering a tool that bridges the gap between today’s congestion and tomorrow’s seamless urban flow.
Works cited
How it Works - Lingo.dev Compiler, accessed February 7, 2026, https://lingo.dev/en/compiler/how-it-works
Next.js Integration - Lingo.dev Compiler, accessed February 7, 2026, https://lingo.dev/en/compiler/frameworks/nextjs
Automating App Localization with Lingo.dev: The Developer's Guide to Seamless CI/CD Integration | by Rithvik K | Medium, accessed February 7, 2026, https://medium.com/@rithvikbng/automating-app-localization-with-lingo-dev-the-developers-guide-to-seamless-ci-cd-integration-46a167fc5428
Lingo.dev - Automated AI localization for web & mobile apps, accessed February 7, 2026, https://lingo.dev/en
Generate Vector Tiles with PostGIS - Supabase, accessed February 7, 2026, https://supabase.com/blog/postgis-generate-vector-tiles
PostGIS: Geo queries | Supabase Docs, accessed February 7, 2026, https://supabase.com/docs/guides/database/extensions/postgis
Row Level Security | Supabase Docs, accessed February 7, 2026, https://supabase.com/docs/guides/database/postgres/row-level-security
Dataset - rta_bus_routes-open - Dubai Pulse, accessed February 7, 2026, https://www.dubaipulse.gov.ae/data/rta-bus/rta_bus_routes-open
Dataset - rta_gtfs-open - Dubai Pulse, accessed February 7, 2026, https://www.dubaipulse.gov.ae/data/rta-public-transports/rta_gtfs-open
United Arab Emirates: High Resolution Population Density Maps + Demographic Estimates, accessed February 7, 2026, https://data.humdata.org/dataset/united-arab-emirates-high-resolution-population-density-maps-demographic-estimates
WorldPop :: Population Counts, accessed February 7, 2026, https://hub.worldpop.org/geodata/summary?id=56786
Bus Shelter (OpenData) - Overview - ArcGIS Online, accessed February 7, 2026, https://www.arcgis.com/home/item.html?id=ae63c99980884a0c83db7df64521054c
Darbi - App Store - Apple, accessed February 7, 2026, https://apps.apple.com/il/app/darbi/id840100351
News Details - Roads & Transport Authority, accessed February 7, 2026, https://www.rta.ae/wps/portal/rta/ae/home/news-and-media/all-news/NewsDetails/completion-of-3-traffic-improvements-in-business-bay-area
RTA completes 3 traffic improvements on Business Bay area | Emirates News Agency, accessed February 7, 2026, https://www.wam.ae/en/article/15mz3df-rta-completes-traffic-improvements-business-bay
Dubai Business Bay Master Plan - Systematica, accessed February 7, 2026, https://www.systematica.net/project/dubai-business-bay-master-plan/
New Traffic Improvement Projects Cut Travel Time in Business Bay - ArabWheels, accessed February 7, 2026, https://www.arabwheels.ae/blog/new-traffic-improvement-projects-cut-travel-time-in-business-bay/
Growth plans revealed for Reem Island by Abu Dhabi Urban Planning Council, accessed February 7, 2026, https://www.commercialinteriordesign.com/insight/growth-plans-revealed-for-reem-island-by-abu-dhabi-urban-planning-council
Abu Dhabi Link for Android - Download, accessed February 7, 2026, https://abu-dhabi-link.en.softonic.com/android
Integrated Transport Centre (Abu Dhabi, accessed February 7, 2026, https://admobility.gov.ae/
Dubai To Abu Dhabi Bus - Services, Bus Timings And Schedule - Dubai Online, accessed February 7, 2026, https://www.dubai-online.com/transport/buses/routes/dubai-to-abu-dhabi/
Abu Dhabi, Central Bus Station:هﺎﺠﺗا | PDF - Scribd, accessed February 7, 2026, https://www.scribd.com/document/663900865/428302
RTA E101 bus - Dubai - Transit, accessed February 7, 2026, https://transitapp.com/en/region/dubai/rta/bus-e101
Promotion - Roads & Transport Authority, accessed February 7, 2026, https://www.rta.ae/wps/portal/rta/ae/home/promotion/intercity-e-ticketing
Public Transport Services, accessed February 7, 2026, https://admobility.gov.ae/en/inter-emirates-services
Bus Tracking App Hackathon Pitch Deck by Shrestho Sarkar on Prezi, accessed February 7, 2026, https://prezi.com/p/9i8q_0qwy_0_/bus-tracking-app-hackathon-pitch-deck/
100 new AC bus shelters for Abu Dhabi city - Gulf News, accessed February 7, 2026, https://gulfnews.com/uae/transport/100-new-ac-bus-shelters-for-abu-dhabi-city-1.2264975
Lack of AC in Abu Dhabi bus shelters has commuters hot and bothered - The National News, accessed February 7, 2026, https://www.thenationalnews.com/uae/lack-of-ac-in-abu-dhabi-bus-shelters-has-commuters-hot-and-bothered-1.464269
Air-conditioned bus shelters launched in Abu Dhabi - Gulf News, accessed February 7, 2026, https://gulfnews.com/uae/transport/air-conditioned-bus-shelters-launched-in-abu-dhabi-1.490363
Public transit planning app | Ann Marie Designs | Plan Efficient Routes, accessed February 7, 2026, https://www.annmariedesigns.co/portfolio/planr
How Can You Build a Smart and User-Friendly Bus App? | Codementor, accessed February 7, 2026, https://www.codementor.io/@rajdeep885527/how-can-you-build-a-smart-and-user-friendly-bus-app-2qkj3lfuqz
Examples | Mapbox GL JS, accessed February 7, 2026, https://docs.mapbox.com/mapbox-gl-js/example/
