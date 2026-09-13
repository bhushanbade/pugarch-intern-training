import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("day-03/dataset/clean_facilities.csv")

plt.figure(figsize=(10, 5))

plt.bar(
    df["facility_name"],
    df["cleanliness_score"]
)

plt.xlabel("Facility")
plt.ylabel("Cleanliness Score")
plt.title("Facility Cleanliness Scores")

plt.xticks(rotation=45)

plt.tight_layout()

plt.savefig("cleanliness_scores.png")

plt.show()