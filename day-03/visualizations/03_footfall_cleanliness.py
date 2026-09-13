import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("../dataset/clean_facilities.csv")

plt.figure(figsize=(8, 5))

plt.scatter(
    df["footfall"],
    df["cleanliness_score"]
)

plt.xlabel("Footfall")
plt.ylabel("Cleanliness Score")
plt.title("Footfall vs Cleanliness")

plt.tight_layout()

plt.savefig("footfall_vs_cleanliness.png")

plt.show()