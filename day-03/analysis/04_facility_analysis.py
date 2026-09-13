import pandas as pd

df = pd.read_csv("day-03/dataset/clean_facilities.csv")

print("===== Facility Analysis =====")

print("\nTotal Facilities:")
print(len(df))

print("\nAverage Cleanliness Score:")
print(df["cleanliness_score"].mean())

print("\nAverage Odor Score:")
print(df["odor_score"].mean())

print("\nTotal Complaints:")
print(df["complaints"].sum())

print("\nHighest Footfall:")
print(df["footfall"].max())

print("\nFacilities with High Waste:")
print(df[df["waste_level"] == "High"])