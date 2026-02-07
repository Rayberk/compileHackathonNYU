import pandas as pd
import geopandas as gpd

# 1. Load your data
# Ensure these filenames match what you uploaded to the /data folder
pop_df = pd.read_csv('data/Population_By_Community.csv')
stops_df = pd.read_csv('data/Public_Transportation_Routes_Stops.csv')
communities_gdf = gpd.read_file('data/dubai_communities.geojson')

# 2. Convert stops to GeoPoints using your specific column names
from shapely.geometry import Point
geometry = [Point(xy) for xy in zip(stops_df['stop_location_longitude'], stops_df['stop_location_latitude'])]
stops_gdf = gpd.GeoDataFrame(stops_df, geometry=geometry, crs="EPSG:4326")

# 3. Spatial Join
merged = gpd.sjoin(stops_gdf, communities_gdf, how="inner", predicate="intersects")
stop_counts = merged.groupby('CNAME_E').size().reset_index(name='stop_count')

# 4. The "Final Fix": Clean the names so they match
# This removes numbers like "334 - " and makes the names match CNAME_E
pop_df['community_clean'] = pop_df['communitynumber_communityname_en'].str.split('-').str[-1].str.strip().str.upper()
stop_counts['community_clean'] = stop_counts['CNAME_E'].str.strip().str.upper()

# 5. Merge and Normalize
final_data = pd.merge(pop_df, stop_counts, on='community_clean')
final_data['pop_norm'] = (final_data['population'] - final_data['population'].min()) / (final_data['population'].max() - final_data['population'].min())
final_data['stop_norm'] = (final_data['stop_count'] - final_data['stop_count'].min()) / (final_data['stop_count'].max() - final_data['stop_count'].min())

final_data.to_csv('data/dubai_model_ready.csv', index=False)
print("SUCCESS: Data merged into data/dubai_model_ready.csv")