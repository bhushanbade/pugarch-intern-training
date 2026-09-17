import pandas as pd

df = pd.read_csv("day-03/dataset/facilities_day3_updated.csv")

print("Before cleaning:")
print(df.shape)

df = df.drop_duplicates()

df["cleanliness_score"] = pd.to_numeric(
    df["cleanliness_score"],
    errors="coerce"
)

df["odor_score"] = pd.to_numeric(
    df["odor_score"],
    errors="coerce"
)

df["complaints"] = pd.to_numeric(
    df["complaints"],
    errors="coerce"
)

df["footfall"] = pd.to_numeric(
    df["footfall"],
    errors="coerce"
)

df["hours_since_cleaning"] = pd.to_numeric(
    df["hours_since_cleaning"],
    errors="coerce"
)

df = df.dropna()

print("After cleaning:")
print(df.shape)

df.to_csv("day-03/dataset/clean_facilities.csv", index=False)

print("Cleaned dataset saved.")