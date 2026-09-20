let employees = [];
async function loadEmployees() {
    const response = await fetch("employees.json");
    employees = await response.json();
    displayEmployees();
}

loadEmployees();
let editId = null;

const list = document.getElementById("employees");
const search = document.getElementById("search");
const department = document.getElementById("department");

function displayEmployees() {
    let data = employees.filter(e =>
        e.name.toLowerCase().includes(search.value.toLowerCase()) &&
        (!department.value || e.department === department.value)
    );

    list.innerHTML = data.map(e => `
        <div class="card">
            <h3>${e.name}</h3>
            <p><b>Department:</b> ${e.department}</p>
            <p><b>Experience:</b> ${e.experience} years</p>
            <p><b>Email:</b> ${e.email}</p>

            <div class="actions">
                <button class="view" onclick="viewEmployee(${e.id})">View</button>
                <button class="edit" onclick="editEmployee(${e.id})">Edit</button>
                <button class="delete" onclick="deleteEmployee(${e.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

function viewEmployee(id) {
    const e = employees.find(e => e.id === id);
    alert(`Name: ${e.name}\nDepartment: ${e.department}\nExperience: ${e.experience} years\nEmail: ${e.email}`);
}

function deleteEmployee(id) {
    if (confirm("Delete this employee?")) {
        employees = employees.filter(e => e.id !== id);
        displayEmployees();
    }
}

function editEmployee(id) {
    const e = employees.find(e => e.id === id);

    editId = id;
    document.getElementById("formTitle").textContent = "Edit Employee";

    name.value = e.name;
    dept.value = e.department;
    experience.value = e.experience;
    email.value = e.email;

    openForm();
}

function openForm() {
    document.getElementById("modal").style.display = "flex";
}

function closeForm() {
    document.getElementById("modal").style.display = "none";
    editId = null;
}

function saveEmployee() {
    const employee = {
        id: editId || Date.now(),
        name: name.value,
        department: dept.value,
        experience: Number(experience.value),
        email: email.value
    };

    if (editId) {
        employees = employees.map(e => e.id === editId ? employee : e);
    } else {
        employees.push(employee);
    }

    closeForm();
    displayEmployees();
}
function sortEmployees() {
    employees.sort((a, b) => b.experience - a.experience);
    displayEmployees();
}
search.addEventListener("input", displayEmployees);
department.addEventListener("change", displayEmployees);

displayEmployees();