const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/employees.json");

function getEmployees() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveEmployees(employees) {
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
}

function getEmployeeById(id) {
  const employees = getEmployees();
  return employees.find(employee => employee.id === id);
}

function createEmployee(employeeData) {
  const employees = getEmployees();

  const newEmployee = {
    id: employees.length
      ? Math.max(...employees.map(employee => employee.id)) + 1
      : 1,
    ...employeeData
  };

  employees.push(newEmployee);
  saveEmployees(employees);

  return newEmployee;
}

function updateEmployee(id, employeeData) {
  const employees = getEmployees();

  const index = employees.findIndex(employee => employee.id === id);

  if (index === -1) {
    return null;
  }

  employees[index] = {
    ...employees[index],
    ...employeeData,
    id
  };

  saveEmployees(employees);

  return employees[index];
}

function deleteEmployee(id) {
  const employees = getEmployees();

  const index = employees.findIndex(employee => employee.id === id);

  if (index === -1) {
    return null;
  }

  const deletedEmployee = employees.splice(index, 1)[0];

  saveEmployees(employees);

  return deletedEmployee;
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};