export {};
interface Employee {
  name: string;
  age: number;
    department?: string;
}

const employee1: Employee = {
  name: "Bhushan",
  age: 21
};

const employee2: Employee = {
  name: "Rahul",
  age: 22,
  department: "IT"
};

console.log(employee1);
console.log(employee2);