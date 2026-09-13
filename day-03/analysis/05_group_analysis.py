import pandas as pd

df = pd.read_csv("day-03/dataset/clean_facilities.csv")

df.columns = df.columns.str.strip()

group_analysis = df.groupby("location").agg({
    "cleanliness_score": "mean",
    "complaints": "sum",
    "footfall": "sum"
})

print("\nLocation Analysis:")
print(group_analysis)