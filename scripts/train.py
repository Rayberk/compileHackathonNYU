import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd

# 1. Load Data
df = pd.read_csv('data/dubai_data.csv')
# Features: everything except the 'neighborhood' and 'priority_score'
X = torch.tensor(df[['population_density', 'job_count', 'growth_rate', 'current_bus_stops']].values, dtype=torch.float32)
# Target: the 'priority_score'
y = torch.tensor(df[['priority_score']].values, dtype=torch.float32)

# 2. Define the Model
model = nn.Sequential(
    nn.Linear(4, 8), # 4 inputs -> 8 hidden neurons
    nn.ReLU(),
    nn.Linear(8, 1)  # 8 hidden -> 1 output (the score)
)

# 3. Loss and Optimizer
criterion = nn.MSELoss() # Mean Squared Error (good for predicting scores)
optimizer = optim.Adam(model.parameters(), lr=0.01)

# 4. The Training Loop
print("Starting training...")
for epoch in range(100):
    optimizer.zero_grad()
    outputs = model(X)
    loss = criterion(outputs, y)
    loss.backward()
    optimizer.step()
    
    if (epoch+1) % 10 == 0:
        print(f'Epoch [{epoch+1}/100], Loss: {loss.item():.4f}')

# 5. Save the result
import os
os.makedirs('models', exist_ok=True)
torch.save(model.state_dict(), "models/model.pth")
print("Model trained and saved to models/model.pth!")