import csv

employees = []

with open("employees.csv", "r") as file:
    reader = csv.DictReader(file)

    for row in reader:
        row["age"] = int(row["age"])
        row["salary"] = float(row["salary"])

        employees.append(row)


print("Total Employees:", len(employees))


total_salary = sum(
    employee["salary"]
    for employee in employees
)

average_salary = total_salary / len(employees)

print("Average Salary:", average_salary)


highest_salary_employee = max(
    employees,
    key=lambda employee: employee["salary"]
)

print("Highest Salary Employee:")
print(highest_salary_employee)


print("\nIT Employees:")

for employee in employees:
    if employee["department"] == "IT":
        print(employee)