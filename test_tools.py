from agent_tools import get_busyness_prediction

# 1. Simulate a request from your AI Agent
print("Testing the connection to the Machine Learning model...")
result = get_busyness_prediction(neighborhood="marina", hour=18, day_type=0)

# 2. Print the result to see if it worked
print(f"Prediction Result: {result}")