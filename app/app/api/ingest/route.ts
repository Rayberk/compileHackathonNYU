import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { source, data_type } = await request.json();

    // Simulate data fetch from Dubai Pulse or Abu Dhabi ITC
    let mockData;

    if (source === "dubai-pulse") {
      mockData = generateMockDubaiStops();
    } else if (source === "abu-dhabi-itc") {
      mockData = generateMockAbuDhabiStops();
    } else {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }

    // Insert into database
    const { data: inserted, error } = await supabase
      .from("stops")
      .insert(mockData);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Ingested ${mockData.length} stops from ${source}`,
      count: mockData.length,
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Ingestion failed" },
      { status: 500 }
    );
  }
}

function generateMockDubaiStops() {
  return [
    {
      stop_id: "DXB-001",
      stop_name: "Business Bay Metro",
      stop_name_ar: "مترو الخليج التجاري",
      location: `POINT(55.2708 25.2048)`,
      stop_type: "AC Shelter",
      is_active: true,
      metadata: { internal_temp: 24, cctv: true },
    },
    {
      stop_id: "DXB-002",
      stop_name: "Dubai Mall",
      stop_name_ar: "دبي مول",
      location: `POINT(55.2783 25.1972)`,
      stop_type: "AC Shelter",
      is_active: true,
      metadata: { internal_temp: 22, cctv: true },
    },
    {
      stop_id: "DXB-003",
      stop_name: "Burj Khalifa",
      stop_name_ar: "برج خليفة",
      location: `POINT(55.2744 25.1972)`,
      stop_type: "Covered",
      is_active: true,
      metadata: { internal_temp: 28, cctv: true },
    },
    {
      stop_id: "DXB-004",
      stop_name: "Sheikh Zayed Road",
      stop_name_ar: "شارع الشيخ زايد",
      location: `POINT(55.2605 25.1981)`,
      stop_type: "Pole",
      is_active: true,
      metadata: { internal_temp: 26, cctv: false },
    },
    {
      stop_id: "DXB-005",
      stop_name: "Dubai Marina",
      stop_name_ar: "دبي مارينا",
      location: `POINT(55.1410 25.0805)`,
      stop_type: "AC Shelter",
      is_active: true,
      metadata: { internal_temp: 33, cctv: true }, // Over threshold for maintenance alert
    },
  ];
}

function generateMockAbuDhabiStops() {
  return [
    {
      stop_id: "AUH-001",
      stop_name: "Reem Central Mall",
      stop_name_ar: "مول ريم المركزي",
      location: `POINT(54.3773 24.4539)`,
      stop_type: "AC Shelter",
      is_active: true,
      metadata: { internal_temp: 22, cctv: true },
    },
    {
      stop_id: "AUH-002",
      stop_name: "Shams Abu Dhabi",
      stop_name_ar: "شمس أبوظبي",
      location: `POINT(54.3850 24.4580)`,
      stop_type: "AC Shelter",
      is_active: true,
      metadata: { internal_temp: 23, cctv: true },
    },
    {
      stop_id: "AUH-003",
      stop_name: "Gate Towers",
      stop_name_ar: "أبراج البوابة",
      location: `POINT(54.3700 24.4500)`,
      stop_type: "Covered",
      is_active: true,
      metadata: { internal_temp: 27, cctv: true },
    },
    {
      stop_id: "AUH-004",
      stop_name: "Al Reem Beach",
      stop_name_ar: "شاطئ الريم",
      location: `POINT(54.3820 24.4640)`,
      stop_type: "AC Shelter",
      is_active: true,
      metadata: { internal_temp: 31, cctv: true }, // Over threshold for maintenance alert
    },
    {
      stop_id: "AUH-005",
      stop_name: "Repton School",
      stop_name_ar: "مدرسة ريبتون",
      location: `POINT(54.3650 24.4450)`,
      stop_type: "Pole",
      is_active: true,
      metadata: { internal_temp: 29, cctv: false },
    },
  ];
}
