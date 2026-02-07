"""
Custom tools for the Dubai RTA City Planning Agent.
These tools allow the agent to interact with ML APIs and analyze transport data.
"""
import os
import httpx
from typing import Optional

# ML API URL from environment
ML_API_URL = os.getenv("ML_API_URL", "http://localhost:8000/predict")


async def get_ml_predictions(
    latitude: float,
    longitude: float,
    radius_km: float = 1.0,
    prediction_type: str = "traffic"
) -> dict:
    """
    Get ML predictions for traffic/transport patterns at given coordinates.
    
    Args:
        latitude: Latitude of the center point (e.g., 25.2048 for Dubai)
        longitude: Longitude of the center point (e.g., 55.2708 for Dubai)
        radius_km: Radius in kilometers to analyze (default: 1.0)
        prediction_type: Type of prediction - 'traffic', 'demand', or 'congestion'
    
    Returns:
        Dictionary containing ML predictions and analysis
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                ML_API_URL,
                json={
                    "lat": latitude,
                    "lng": longitude,
                    "radius": radius_km,
                    "type": prediction_type
                }
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        return {
            "error": f"ML API request failed: {str(e)}",
            "status": "unavailable",
            "fallback_message": "The ML prediction service is currently unavailable. Please try again later or provide manual analysis."
        }
    except Exception as e:
        return {
            "error": f"Unexpected error: {str(e)}",
            "status": "error"
        }


async def analyze_transport_coverage(
    area_name: str,
    include_metro: bool = True,
    include_bus: bool = True,
    include_tram: bool = True,
    include_water_taxi: bool = True
) -> dict:
    """
    Analyze public transport coverage for a named area in Dubai.
    
    Args:
        area_name: Name of the area (e.g., 'Downtown Dubai', 'Dubai Marina', 'JBR')
        include_metro: Whether to analyze metro coverage
        include_bus: Whether to analyze bus coverage
        include_tram: Whether to analyze tram coverage
        include_water_taxi: Whether to analyze water taxi coverage
    
    Returns:
        Dictionary containing transport coverage analysis
    """
    transport_types = []
    if include_metro:
        transport_types.append("metro")
    if include_bus:
        transport_types.append("bus")
    if include_tram:
        transport_types.append("tram")
    if include_water_taxi:
        transport_types.append("water_taxi")
    
    # This would typically call an API, but for hackathon we return structured data
    # that the LLM can augment with its knowledge
    return {
        "area": area_name,
        "transport_types_analyzed": transport_types,
        "status": "analysis_requested",
        "message": f"Analyzing public transport coverage for {area_name}. "
                   f"Please use your knowledge of Dubai's RTA network to provide insights "
                   f"about {', '.join(transport_types)} services in this area."
    }


async def get_area_statistics(
    coordinates: dict,
    include_demographics: bool = True,
    include_traffic: bool = True
) -> dict:
    """
    Get comprehensive statistics for a selected map area.
    
    Args:
        coordinates: Dictionary with 'north', 'south', 'east', 'west' bounds or 'lat', 'lng', 'radius'
        include_demographics: Whether to include population/demographic data
        include_traffic: Whether to include traffic pattern data
    
    Returns:
        Dictionary containing area statistics
    """
    # Extract coordinates info for the response
    if "lat" in coordinates and "lng" in coordinates:
        location_desc = f"Point at ({coordinates['lat']}, {coordinates['lng']})"
        if "radius" in coordinates:
            location_desc += f" with {coordinates['radius']}km radius"
    elif all(k in coordinates for k in ["north", "south", "east", "west"]):
        location_desc = f"Bounding box: N{coordinates['north']}, S{coordinates['south']}, E{coordinates['east']}, W{coordinates['west']}"
    else:
        location_desc = f"Coordinates: {coordinates}"
    
    return {
        "location": location_desc,
        "coordinates": coordinates,
        "data_requested": {
            "demographics": include_demographics,
            "traffic": include_traffic
        },
        "status": "ready_for_analysis",
        "message": "Area selected for analysis. Use available tools and knowledge to provide comprehensive city planning insights."
    }


# Tool registry for easy access
CUSTOM_TOOLS = [
    get_ml_predictions,
    analyze_transport_coverage,
    get_area_statistics
]
