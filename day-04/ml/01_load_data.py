import pandas as pd

df = pd.read_csv("day-04/dataset/student_data.csv")

print("Student Dataset:")
print(df)

print("\nDataset Information:")
print(df.info())

print("\nFirst 5 Records:")
print(df.head())