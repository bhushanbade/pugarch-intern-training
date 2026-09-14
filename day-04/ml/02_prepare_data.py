import pandas as pd

df = pd.read_csv("day-04/dataset/student_data.csv")

print("Original Data:")
print(df)

X = df[["study_hours", "attendance"]]
y = df["pass"]

print("\nInput Features:")
print(X)

print("\nTarget:")
print(y)