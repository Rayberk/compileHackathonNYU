import requests

CRUSTDATA_API_KEY = "02324ad48798ebfc23dcdc662c60f46be18dd864"

# Keep your original PyTorch tool
def get_busyness_prediction(neighborhood, hour, day_type):
    url = "http://127.0.0.1:5000/predict"
    neighborhood_map = {"marina": 0, "downtown": 1, "jvc": 2}
    n_id = neighborhood_map.get(neighborhood.lower(), 0)
    payload = {"features": [n_id, hour, day_type, 0.8, 0.5]}
    response = requests.post(url, json=payload)
    return response.json() if response.status_code == 200 else "Error"

# Add the new Crustdata tool below it
def get_neighborhood_business_growth(neighborhood_name):
    url = "https://api.crustdata.com/screener/company/search"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Token {CRUSTDATA_API_KEY}"
    }
    payload = {
        "filters": {
            "op": "and",
            "conditions": [
                {"column": "location", "type": "contains", "value": neighborhood_name},
                {"column": "city", "type": "=", "value": "Dubai"}
            ]
        },
        "count": 10
    }
    response = requests.post(url, headers=headers, json=payload)
    return response.json() if response.status_code == 200 else None