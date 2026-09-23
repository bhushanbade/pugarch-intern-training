class Employee {
  constructor(
    public name: string,
    public salary: number
  ) {}

  display() {
    console.log(this.name, this.salary);
  }
}

const employee = new Employee("Bhushan", 40000);

employee.display();