import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# 1. Load your friend's suggested files
pop_df = pd.read_csv('data/Population_By_Community.csv')
stops_df = pd.read_csv('data/Public_Transportation_Routes_Stops.csv')

# 2. Convert stops to a "GeoDataFrame" (Point data)
# Assuming stops_df has 'latitude' and 'longitude' columns
geometry = [Point(xy) for xy in zip(stops_df['stop_location_longitude'], stops_df['stop_location_latitude'])]
stops_gdf = gpd.GeoDataFrame(stops_df, geometry=geometry, crs="EPSG:4326")

# 3. Load Dubai Community Boundaries (GeoJSON or Shapefile)
# You can often find this on Dubai Pulse as 'dm_community-open'
communities_gdf = gpd.read_file('data/dubai.geojson')

# 4. Spatial Join: Assign each stop to a community
stops_with_community = gpd.sjoin(stops_gdf, communities_gdf, how="inner", predicate="intersects")

# 5. Aggregate: Count stops per community
stop_counts = stops_with_community.groupby('CNAME_E').size().reset_index(name='stop_count')

# 6. Merge with Population Data
final_data = pd.merge(pop_df, stop_counts, left_on='Community_Name', right_on='CNAME_E')

# 7. Normalize (Scale between 0 and 1)
final_data['pop_norm'] = (final_data['Population'] - final_data['Population'].min()) / (final_data['Population'].max() - final_data['Population'].min())
final_data['stop_norm'] = (final_data['stop_count'] - final_data['stop_count'].min()) / (final_data['stop_count'].max() - final_data['stop_count'].min())

final_data.to_csv('data/dubai_final_model_data.csv', index=False)
print("Data combined and normalized successfully!")