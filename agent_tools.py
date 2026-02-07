import requests

def get_busyness_prediction(neighborhood, hour, day_type):
    """
    Calls the local Flask API to get a busyness score for a Dubai neighborhood.
    """
    url = "http://127.0.0.1:5000/predict" # Your Flask Address
    
    # Map neighborhood name to a number (your model likes numbers)
    # This is a simple example; you can expand this dictionary
    neighborhood_map = {"marina": 0, "downtown": 1, "jvc": 2}
    n_id = neighborhood_map.get(neighborhood.lower(), 0)
    
    payload = {
        "features": [n_id, hour, day_type, 0.8, 0.5] # Features your model expects
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        return "Error connecting to the ML machine."