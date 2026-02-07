import pandas as pd
import torch
from torch.utils.data import Dataset

class DubaiTransitDataset(Dataset):
    def __init__(self, csv_file):
        self.data = pd.read_csv(csv_file)
        # Assuming last column is the "Priority Score" (what we want to predict)
        self.X = torch.tensor(self.data.iloc[:, :-1].values, dtype=torch.float32)
        self.y = torch.tensor(self.data.iloc[:, -1].values, dtype=torch.float32).reshape(-1, 1)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]