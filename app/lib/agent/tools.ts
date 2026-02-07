import { createClient } from "@/lib/supabase/client";

export interface AgentTool {
  name: string;
  description: string;
  execute: (params: any) => Promise<string>;
}

export const findHotspotsTool: AgentTool = {
  name: "find_transit_hotspots",
  description: "Identifies underserved areas with high commuter density but no nearby bus stops",

  async execute(params: { radius_meters?: number; min_pings?: number }): Promise<string> {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("find_transit_hotspots", {
      search_radius_meters: params.radius_meters || 500,
      min_ping_count: params.min_pings || 10,
    });

    if (error) {
      console.error("Error calling find_transit_hotspots:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return "No significant hotspots found in the current area.";
    }

    const topHotspot = data[0];
    const count = data.length;

    return `I've identified ${count} hotspot${count > 1 ? "s" : ""} in the area. The highest priority location is at coordinates ${topHotspot.cluster_lat.toFixed(4)}, ${topHotspot.cluster_lon.toFixed(4)} with ${topHotspot.total_pings} commuter pings but no AC shelters within 500 meters.`;
  },
};
