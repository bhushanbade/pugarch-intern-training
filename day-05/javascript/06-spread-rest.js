const employee = {
    id: 1,
    name: "Rahul",
    department: "IT"
};

const updatedEmployee = {
    ...employee,
    salary: 50000
};

console.log(updatedEmployee);


function calculateTotal(...numbers) {
    return numbers.reduce((total, number) => total + number, 0);
}

console.log(calculateTotal(10, 20, 30, 40));