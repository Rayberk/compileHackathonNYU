from flask import Flask, request, jsonify
import torch

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # 1. Get the data from the AI Agent
    data = request.json
    
    # 2. Logic to process data and run it through your model.pth
    # prediction = model(torch.tensor(data['features']))
    
    # 3. Send the answer back
    return jsonify({"status": "success", "priority_score": 0.88})

if __name__ == '__main__':
    app.run(debug=True, port=5000)