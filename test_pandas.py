import pandas as pd

# Create a tiny mock of your Dubai project data
data = {
    'Neighborhood': ['Dubai Marina', 'Downtown', 'JVC'],
    'Population': [50000, 30000, 45000]
}

df = pd.DataFrame(data)
print("Pandas is ready! Here is your test data:")
print(df)