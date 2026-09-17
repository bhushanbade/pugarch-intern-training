import pandas as pd

df = pd.read_csv("day-03/dataset/clean_facilities.csv")


def calculate_risk(row):
    score = 0

    if row["cleanliness_score"] <= 5:
        score += 2

    if row["odor_score"] <= 5:
        score += 2

    if row["waste_level"] == "High":
        score += 2

    if row["complaints"] >= 7:
        score += 2

    if row["hours_since_cleaning"] >= 8:
        score += 2

    return score


df["risk_score"] = df.apply(calculate_risk, axis=1)


def risk_level(score):
    if score >= 6:
        return "High"
    elif score >= 3:
        return "Medium"
    else:
        return "Low"


df["risk_level"] = df["risk_score"].apply(risk_level)


print("===== Facility Risk Analysis =====")

print(
    df[
        [
            "facility_id",
            "location",
            "facility_type",
            "risk_score",
            "risk_level"
        ]
    ]
)

df.to_csv(
    "day-03/dataset/facility_risk_analysis.csv",
    index=False
)

print("\nRisk analysis saved successfully.")