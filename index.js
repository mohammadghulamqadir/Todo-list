let table = document.querySelector(".task-list");
let tableBody = document.querySelector(".task-list-body");
let errorElement = document.getElementById("error");
let emptyMessage = document.getElementById("emptyMessage");
let editPopup = document.getElementById("editPopup");
let deleteConfirmPopup = document.getElementById("deleteConfirmPopup");
let deleteConfirmIndex = -1;

let todos = [];
let editIndex = -1;

function validateTask(task, date) {
    if (task === "" || task.length <= 3) {
        return "Please Enter a Valid task.";
    } else if (date === "") {
        return "Please select a date.";
    }
    return "";
}

function addTask(e) {
    e.preventDefault();
    const inputValue = document.getElementById("box").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const val = document.getElementById("urgency").value == "true";
    errorElement.innerHTML = validateTask(inputValue, dueDate);

    if (!errorElement.innerHTML) {
        if (!isTaskAlreadyExists(inputValue, dueDate, val)) {
            todos.push({
                task: inputValue,
                date: dueDate,
                urgent: val,
                completed: false,
            });

            renderHtml();
            document.getElementById("box").value = "";
            document.getElementById("dueDate").value = "";
        } else {
            errorElement.innerHTML =
                "It already exists. Please choose a different task.";
        }
    }
}

document.getElementById("search").addEventListener("input", function () {
    let input = document.getElementById("search").value.toLowerCase().trim();
    let res = todos.filter((todo) => {
        for (const value of Object.values(todo)) {
            if (value.toString().toLowerCase().includes(input)) {
                return true;
            }
        }
        return false;
    });

    renderHtml(res);
    if (res.length === 0) {
        document.getElementById("emptyMessage").innerHTML = "No matching tasks found.";
    } else {
        document.getElementById("emptyMessage").innerHTML = "";
    }
});


function finishedTask(item) {
    return item.completed ? ' style="background-color: green; color: white;"' : '';
}
function urgentTask(item) {
    return item.urgent ? ' style="background-color: red; color: white;"' : '';
}

function renderHtml(data = todos) {
    tableBody.innerHTML = "";
    if (data.length > 0) {
        table.style.display = "table";
        emptyMessage.style.display = "none";
        data.forEach((item, index) => {
            const completeItem = finishedTask(item);
            const urgentItem = urgentTask(item);
            const taskHtml = `<td>${item.task}</td>`;
            tableBody.innerHTML += `
            <tr ${completeItem}${urgentItem} >
              ${taskHtml}
              <td>${item.date}</td>
              <td>${item.urgent ? "Urgent" : "Not Urgent"}</td>
              <td>
                <button ${item.completed ? 'style="display: none;"' : ""
                } onclick="edit(${index})">Edit</button>
                <button onclick="completeTask(${index})">Complete</button>
                <button onclick="removeTask(${index})">Delete</button>
              </td>
            </tr>`;
        });
    } else {
        table.style.display = "none";
        emptyMessage.style.display = "block";
    }
}


function removeTask(val) {
    deleteConfirmIndex = val;
    deleteConfirmPopup.style.display = "block";
}

function openEditPopup(index) {
    editIndex = index;
    let editTaskInput = document.getElementById("editTask");
    let editDateInput = document.getElementById("editDate");
    let editUrgencySelect = document.getElementById("editUrgency");

    editTaskInput.value = todos[index].task;
    editDateInput.value = todos[index].date;
    editUrgencySelect.value = todos[index].urgent.toString();

    editPopup.style.display = "block";
}

function updateTask() {
    let editTaskInput = document.getElementById("editTask");
    let editDateInput = document.getElementById("editDate");
    let editUrgencySelect = document.getElementById("editUrgency");

    validateTask(editTaskInput, editDateInput);
    todos[editIndex].task = editTaskInput.value;
    todos[editIndex].date = editDateInput.value;
    todos[editIndex].urgent = editUrgencySelect.value === "true";

    closePopup();
    renderHtml();
}

function closePopup() {
    editPopup.style.display = "none";
    editIndex = -1;
}

function edit(index) {
    openEditPopup(index);
}

function completeTask(index) {
    todos[index].completed = !todos[index].completed;
    renderHtml();
}


// Functions for delete confirmation
function confirmDeleteTask() {
    if (deleteConfirmIndex !== -1) {
        todos.splice(deleteConfirmIndex, 1);
        renderHtml();
        deleteConfirmIndex = -1;
        deleteConfirmPopup.style.display = "none";
    }
}

function cancelDeleteTask() {
    deleteConfirmIndex = -1;
    deleteConfirmPopup.style.display = "none";
}

function isTaskAlreadyExists(task, date, val) {
    return todos.some(
        (item) =>
            item.task === task &&
            item.date === date && item.urgent === val
    );
}
