import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now your original imports will work
from scripts.agent_tools import get_busyness_prediction

from scripts.agent_tools import get_busyness_prediction, get_neighborhood_business_growth

# Test 1: Check the PyTorch Model
print("--- Testing PyTorch Model ---")
ml_result = get_busyness_prediction("marina", 18, 0)
print(f"ML Prediction: {ml_result}")

# Test 2: Check the Crustdata Tool
print("\n--- Testing Crustdata Signals ---")
growth_data = get_neighborhood_business_growth("Marina")
print(f"Crustdata Signals: {growth_data}")

def get_busyness_prediction(neighborhood, population, other_stuff=None):
    # We ignore the name and other stuff for the math, 
    # and just send the population to the model.
    payload = {"features": [float(population)]} 
    response = requests.post(API_URL, json=payload)
    return response.json()