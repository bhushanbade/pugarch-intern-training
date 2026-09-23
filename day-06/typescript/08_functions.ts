function calculateSalary(salary: number, bonus: number): number {
  return salary + bonus;
}

const total = calculateSalary(40000, 5000);

console.log(total);