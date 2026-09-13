import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("../dataset/clean_facilities.csv")

plt.figure(figsize=(10, 5))

plt.bar(
    df["facility_name"],
    df["complaints"]
)

plt.xlabel("Facility")
plt.ylabel("Complaints")
plt.title("Complaints by Facility")

plt.xticks(rotation=45)

plt.tight_layout()

plt.savefig("complaints.png")

plt.show()