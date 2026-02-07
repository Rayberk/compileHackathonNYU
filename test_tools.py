from scripts.agent_tools import get_busyness_prediction, get_neighborhood_business_growth

# Test 1: Check the PyTorch Model
print("--- Testing PyTorch Model ---")
ml_result = get_busyness_prediction("marina", 18, 0)
print(f"ML Prediction: {ml_result}")

# Test 2: Check the Crustdata Tool
print("\n--- Testing Crustdata Signals ---")
growth_data = get_neighborhood_business_growth("Marina")
print(f"Crustdata Signals: {growth_data}")