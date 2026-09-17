import pandas as pd

df = pd.read_csv("day-03/dataset/facilities_day3_updated.csv")

print("First five rows:")
print(df.head())

print("\nDataset information:")
print(df.info())

print("\nColumn names:")
print(df.columns)

print("\nBasic statistics:")
print(df.describe())