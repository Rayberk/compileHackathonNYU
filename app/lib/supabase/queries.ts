import { createClient } from "@/lib/supabase/client";

export interface MaintenanceAlert {
  id: string;
  stop_id: string;
  stop_name: string;
  stop_name_ar?: string;
  location: any;
  stop_type: string;
  metadata: {
    internal_temp?: number;
    cctv?: boolean;
    [key: string]: any;
  };
}

export async function getMaintenanceAlerts(): Promise<MaintenanceAlert[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("stops")
    .select("*")
    .in("stop_type", ["AC Shelter", "Covered"])
    .gt("metadata->internal_temp", 30);

  if (error) {
    console.error("Error fetching maintenance alerts:", error);
    return [];
  }

  return (data as MaintenanceAlert[]) || [];
}
