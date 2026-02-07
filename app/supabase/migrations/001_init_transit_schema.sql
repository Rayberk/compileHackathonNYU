-- Enable PostGIS extension in a dedicated schema
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

-- Function to find transit hotspots (high-density areas underserved by current stops)
CREATE OR REPLACE FUNCTION find_transit_hotspots(search_radius_meters float, min_ping_count int)
RETURNS TABLE (cluster_lat float, cluster_lon float, total_pings bigint)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH clusters AS (
    -- Cluster pings using grid-based approach for efficiency
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
