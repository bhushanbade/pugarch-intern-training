import pandas as pd

data = {
    "name": ["Bhushan", "Rahul", "Amit", "Neha"],
    "department": ["IT", "HR", "IT", "Finance"],
    "salary": [45000, 40000, 50000, 55000]
}

df = pd.DataFrame(data)

print(df)

print("\nAverage Salary:")
print(df["salary"].mean())

print("\nIT Employees:")
print(df[df["department"] == "IT"])