async function loadEmployees() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        const employees = await response.json();

        console.log(employees);
    } catch (error) {
        console.log("Error loading employees:", error);
    }
}

loadEmployees();