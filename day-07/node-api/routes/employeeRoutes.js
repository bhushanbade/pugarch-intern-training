const express = require("express");

const {
  getAllEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  removeEmployee
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/:id", getEmployee);
router.post("/", addEmployee);
router.put("/:id", editEmployee);
router.delete("/:id", removeEmployee);

module.exports = router;