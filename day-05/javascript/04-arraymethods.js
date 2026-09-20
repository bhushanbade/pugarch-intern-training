const employees = [
    { id: 1, name: "Rahul", department: "IT", salary: 50000 },
    { id: 2, name: "Priya", department: "HR", salary: 45000 },
    { id: 3, name: "Amit", department: "IT", salary: 60000 }
];

const names = employees.map(employee => employee.name);

const itEmployees = employees.filter(
    employee => employee.department === "IT"
);

const totalSalary = employees.reduce(
    (total, employee) => total + employee.salary,
    0
);

const employee = employees.find(
    employee => employee.id === 2
);

const hasHighSalary = employees.some(
    employee => employee.salary > 55000
);

const everyoneHasSalary = employees.every(
    employee => employee.salary > 0
);

const sortedEmployees = [...employees].sort(
    (a, b) => b.salary - a.salary
);

console.log("Names:", names);
console.log("IT Employees:", itEmployees);
console.log("Total Salary:", totalSalary);
console.log("Employee:", employee);
console.log("Has High Salary:", hasHighSalary);
console.log("Everyone Has Salary:", everyoneHasSalary);
console.log("Sorted:", sortedEmployees);