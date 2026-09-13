import pandas as pd

df = pd.read_csv("day-03/dataset/facilities.csv")

print("Missing values:")
print(df.isnull().sum())

print("\nDuplicate rows:")
print(df.duplicated().sum())