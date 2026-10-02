let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let loadSamplesBtn = document.getElementById("loadSamplesBtn");
let taskList = document.getElementById("taskList");
let taskMessage = document.getElementById("taskMessage");
let totalCount = document.getElementById("totalCount");
let pendingCount = document.getElementById("pendingCount");
let completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateCounts() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let pending = total - completed;
    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

function render() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) li.classList.add("completed");

        let span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        let compBtn = document.createElement("button");
        compBtn.textContent = task.completed? "Undo" : "Complete";
        compBtn.className = "complete-btn";
        compBtn.onclick = () => toggleTask(index);

        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => editTask(index);

        let delBtn = document.createElement("button");
        delBtn.textContent = "Remove";
        delBtn.className = "remove-btn";
        delBtn.onclick = () => removeTask(index);

        li.appendChild(span);
        li.appendChild(compBtn);
        li.appendChild(editBtn);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
    updateCounts();
    saveTasks();
}

function addTask(text) {
    let t = (text || taskInput.value).trim();
    if (t === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }
    tasks.push({ text: t, completed: false });
    taskInput.value = "";
    taskMessage.textContent = "";
    render();
}

function toggleTask(i) {
    tasks[i].completed =!tasks[i].completed;
    render();
}

function removeTask(i) {
    tasks.splice(i, 1);
    render();
}

function editTask(i) {
    let newText = prompt("Edit task:", tasks[i].text);
    if (newText === null) return;
    if (newText.trim() === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }
    tasks[i].text = newText.trim();
    render();
}

function loadSampleTasks() {
    let samples = ["Review DOM selectors", "Practice createElement", "Study event delegation"];
    samples.forEach(s => tasks.push({ text: s, completed: false }));
    render();
}

addTaskBtn.addEventListener("click", () => addTask());
taskInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });
loadSamplesBtn.addEventListener("click", loadSampleTasks);

render();
