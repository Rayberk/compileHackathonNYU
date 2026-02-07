import requests

# Use your real key here
headers = {"Authorization": "Token YOUR_ACTUAL_KEY"}
res = requests.post("https://api.crustdata.com/screener/company/search", 
                    headers=headers, 
                    json={"filters": [], "count": 1})

print(f"Status: {res.status_code}")
print(f"Response: {res.text}")