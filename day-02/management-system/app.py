import json
import os

FILE_NAME = "employees.json"


def load_employees():
    if not os.path.exists(FILE_NAME):
        return []

    try:
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_employees(employees):
    with open(FILE_NAME, "w") as file:
        json.dump(employees, file, indent=4)


def get_next_id(employees):
    if not employees:
        return 1

    return max(employee["id"] for employee in employees) + 1


def add_employee(employees):
    try:
        name = input("Enter name: ")
        age = int(input("Enter age: "))
        department = input("Enter department: ")
        salary = float(input("Enter salary: "))

        employee = {
            "id": get_next_id(employees),
            "name": name,
            "age": age,
            "department": department,
            "salary": salary
        }

        employees.append(employee)
        save_employees(employees)

        print("Employee added successfully.")

    except ValueError:
        print("Invalid input. Please enter valid numbers.")


def update_employee(employees):
    try:
        employee_id = int(input("Enter employee ID: "))

        employee = next(
            (emp for emp in employees if emp["id"] == employee_id),
            None
        )

        if employee is None:
            print("Employee not found.")
            return

        name = input("Enter new name: ")
        age = int(input("Enter new age: "))
        department = input("Enter new department: ")
        salary = float(input("Enter new salary: "))

        employee["name"] = name
        employee["age"] = age
        employee["department"] = department
        employee["salary"] = salary

        save_employees(employees)

        print("Employee updated successfully.")

    except ValueError:
        print("Invalid input.")


def delete_employee(employees):
    try:
        employee_id = int(input("Enter employee ID: "))

        employee = next(
            (emp for emp in employees if emp["id"] == employee_id),
            None
        )

        if employee is None:
            print("Employee not found.")
            return

        employees.remove(employee)
        save_employees(employees)

        print("Employee deleted successfully.")

    except ValueError:
        print("Invalid ID.")


def search_employee(employees):
    name = input("Enter employee name: ").lower()

    results = [
        employee
        for employee in employees
        if name in employee["name"].lower()
    ]

    if not results:
        print("Employee not found.")
        return

    for employee in results:
        print(employee)


def filter_department(employees):
    department = input("Enter department: ").lower()

    results = [
        employee
        for employee in employees
        if employee["department"].lower() == department
    ]

    if not results:
        print("No employees found.")
        return

    for employee in results:
        print(employee)


def sort_employees(employees):
    print("\n1. Sort by name")
    print("2. Sort by salary")

    choice = input("Choose option: ")

    if choice == "1":
        sorted_employees = sorted(
            employees,
            key=lambda employee: employee["name"]
        )

    elif choice == "2":
        sorted_employees = sorted(
            employees,
            key=lambda employee: employee["salary"],
            reverse=True
        )

    else:
        print("Invalid choice.")
        return

    for employee in sorted_employees:
        print(employee)


def statistics(employees):
    if not employees:
        print("No employees available.")
        return

    total_salary = sum(
        employee["salary"]
        for employee in employees
    )

    average_salary = total_salary / len(employees)

    highest_salary = max(
        employees,
        key=lambda employee: employee["salary"]
    )

    print("\n===== Statistics =====")
    print("Total Employees:", len(employees))
    print("Average Salary:", average_salary)
    print("Highest Salary Employee:", highest_salary)


def list_employees(employees):
    if not employees:
        print("No employees available.")
        return

    print("\n===== Employee List =====")

    for employee in employees:
        print(employee)


def show_menu():
    print("\n===== Employee Management System =====")
    print("1. Add Employee")
    print("2. Update Employee")
    print("3. Delete Employee")
    print("4. Search Employee")
    print("5. List Employees")
    print("6. Filter by Department")
    print("7. Sort Employees")
    print("8. Statistics")
    print("9. Exit")


def main():
    employees = load_employees()

    while True:
        show_menu()

        choice = input("Enter your choice: ")

        if choice == "1":
            add_employee(employees)

        elif choice == "2":
            update_employee(employees)

        elif choice == "3":
            delete_employee(employees)

        elif choice == "4":
            search_employee(employees)

        elif choice == "5":
            list_employees(employees)

        elif choice == "6":
            filter_department(employees)

        elif choice == "7":
            sort_employees(employees)

        elif choice == "8":
            statistics(employees)

        elif choice == "9":
            print("Exiting application...")
            break

        else:
            print("Invalid choice.")


if __name__ == "__main__":
    main()