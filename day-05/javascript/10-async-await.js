function getEmployeeData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Employee data received");
        }, 1000);
    });
}

async function loadEmployees() {
    try {
        const data = await getEmployeeData();
        console.log(data);
    } catch (error) {
        console.log("Error:", error);
    }
}

loadEmployees();