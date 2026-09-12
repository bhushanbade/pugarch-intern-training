import json

employees = [
    {
        "id": 1,
        "name": "Bhushan",
        "department": "IT",
        "salary": 45000
    },
    {
        "id": 2,
        "name": "Rahul",
        "department": "HR",
        "salary": 40000
    }
]

with open("employees.json", "w") as file:
    json.dump(employees, file, indent=4)

print("Employees saved.")