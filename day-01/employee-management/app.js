const readline = require("readline");

const employees = [
    {
        id: 1,
        name: "Bhushan",
        age: 21,
        department: "IT",
        salary: 45000
    },
    {
        id: 2,
        name: "Rahul",
        age: 23,
        department: "HR",
        salary: 40000
    }
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\n===== Employee Management System =====");
    console.log("1. Add Employee");
    console.log("2. Update Employee");
    console.log("3. Delete Employee");
    console.log("4. Search Employee");
    console.log("5. List Employees");
    console.log("6. Highest Salary");
    console.log("7. Average Salary");
    console.log("8. Department Filter");
    console.log("9. Exit");

    rl.question("Enter your choice: ", handleChoice);
}

function addEmployee() {
    rl.question("Enter employee name: ", (name) => {
        rl.question("Enter age: ", (age) => {
            rl.question("Enter department: ", (department) => {
                rl.question("Enter salary: ", (salary) => {

                    const employee = {
                        id: employees.length + 1,
                        name: name,
                        age: Number(age),
                        department: department,
                        salary: Number(salary)
                    };

                    employees.push(employee);

                    console.log("Employee added successfully.");

                    showMenu();
                });
            });
        });
    });
}

function updateEmployee() {
    rl.question("Enter employee ID: ", (id) => {

        const employee = employees.find(
            emp => emp.id === Number(id)
        );

        if (!employee) {
            console.log("Employee not found.");
            return showMenu();
        }

        rl.question("Enter new name: ", (name) => {
            rl.question("Enter new age: ", (age) => {
                rl.question("Enter new department: ", (department) => {
                    rl.question("Enter new salary: ", (salary) => {

                        employee.name = name;
                        employee.age = Number(age);
                        employee.department = department;
                        employee.salary = Number(salary);

                        console.log("Employee updated successfully.");

                        showMenu();
                    });
                });
            });
        });
    });
}

function deleteEmployee() {
    rl.question("Enter employee ID: ", (id) => {

        const index = employees.findIndex(
            emp => emp.id === Number(id)
        );

        if (index === -1) {
            console.log("Employee not found.");
            return showMenu();
        }

        employees.splice(index, 1);

        console.log("Employee deleted successfully.");

        showMenu();
    });
}

function searchEmployee() {
    rl.question("Enter employee name: ", (name) => {

        const employee = employees.find(
            emp => emp.name.toLowerCase() === name.toLowerCase()
        );

        if (!employee) {
            console.log("Employee not found.");
        } else {
            console.log(employee);
        }

        showMenu();
    });
}

function listEmployees() {

    if (employees.length === 0) {
        console.log("No employees available.");
        return showMenu();
    }

    console.log("\n===== Employee List =====");

    employees.forEach(employee => {
        console.log(employee);
    });

    showMenu();
}

function highestSalary() {

    if (employees.length === 0) {
        console.log("No employees available.");
        return showMenu();
    }

    const employee = employees.reduce(
        (highest, current) =>
            current.salary > highest.salary
                ? current
                : highest
    );

    console.log("\nHighest Salary Employee:");
    console.log(employee);

    showMenu();
}

function averageSalary() {

    if (employees.length === 0) {
        console.log("No employees available.");
        return showMenu();
    }

    const totalSalary = employees.reduce(
        (sum, employee) => sum + employee.salary,
        0
    );

    const average = totalSalary / employees.length;

    console.log(`Average Salary: ${average}`);

    showMenu();
}

function departmentFilter() {
    rl.question("Enter department: ", (department) => {

        const result = employees.filter(
            employee =>
                employee.department.toLowerCase() ===
                department.toLowerCase()
        );

        if (result.length === 0) {
            console.log("No employees found in this department.");
        } else {
            console.log("\nEmployees:");
            result.forEach(employee => {
                console.log(employee);
            });
        }

        showMenu();
    });
}

function handleChoice(choice) {

    switch (choice) {

        case "1":
            addEmployee();
            break;

        case "2":
            updateEmployee();
            break;

        case "3":
            deleteEmployee();
            break;

        case "4":
            searchEmployee();
            break;

        case "5":
            listEmployees();
            break;

        case "6":
            highestSalary();
            break;

        case "7":
            averageSalary();
            break;

        case "8":
            departmentFilter();
            break;

        case "9":
            console.log("Exiting application...");
            rl.close();
            break;

        default:
            console.log("Invalid choice.");
            showMenu();
    }
}

showMenu();