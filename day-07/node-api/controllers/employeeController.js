const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../services/employeeService");

function getAllEmployees(req, res) {
  const employees = getEmployees();

  res.json({
    success: true,
    count: employees.length,
    data: employees
  });
}

function getEmployee(req, res) {
  const id = Number(req.params.id);
  const employee = getEmployeeById(id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  res.json({
    success: true,
    data: employee
  });
}

function addEmployee(req, res) {
  const { name, age, department, salary } = req.body;

  if (!name || !age || !department || !salary) {
    return res.status(400).json({
      success: false,
      message: "All employee fields are required"
    });
  }

  const employee = createEmployee({
    name,
    age: Number(age),
    department,
    salary: Number(salary)
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: employee
  });
}

function editEmployee(req, res) {
  const id = Number(req.params.id);
  const { name, age, department, salary } = req.body;

  if (!name || !age || !department || !salary) {
    return res.status(400).json({
      success: false,
      message: "All employee fields are required"
    });
  }

  const employee = updateEmployee(id, {
    name,
    age: Number(age),
    department,
    salary: Number(salary)
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  res.json({
    success: true,
    message: "Employee updated successfully",
    data: employee
  });
}

function removeEmployee(req, res) {
  const id = Number(req.params.id);
  const employee = deleteEmployee(id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  res.json({
    success: true,
    message: "Employee deleted successfully",
    data: employee
  });
}

module.exports = {
  getAllEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  removeEmployee
};