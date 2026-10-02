let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let loadSamplesBtn = document.getElementById("loadSamplesBtn");
let taskList = document.getElementById("taskList");
let taskMessage = document.getElementById("taskMessage");
let totalCount = document.getElementById("totalCount");
let pendingCount = document.getElementById("pendingCount");
let completedCount = document.getElementById("completedCount");
let taskCounter = parseInt(localStorage.getItem('taskCounter')) || 0;
let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(storedTasks));
    localStorage.setItem('taskCounter', taskCounter.toString());
}

function createTaskElement(taskText, taskId) {
    let li = document.createElement("li");
    li.classList.add("task-item");
    li.dataset.taskId = taskId;
    li.dataset.state = "pending";
    let span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = taskText;
    let completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "Complete";
    let editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";
    let removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";
    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    return li;
}
function addTask(taskText) {
    if (taskText.trim() === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }
    taskCounter++;
    let taskId = "task-" + taskCounter;
    let taskElement = createTaskElement(taskText.trim(), taskId);
    taskList.appendChild(taskElement);
    storedTasks.push({ id: taskId, text: taskText.trim(), state: "pending" });
    saveToStorage();
    taskInput.value = "";
    taskMessage.textContent = "";
    updateTaskCounts();
}
function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");
    if (taskItem.dataset.state === "pending") taskItem.dataset.state = "completed";
    else taskItem.dataset.state = "pending";
    let s = storedTasks.find(t => t.id === taskItem.dataset.taskId);
    if (s) { s.state = taskItem.dataset.state; saveToStorage(); }
    updateTaskCounts();
}
function beginTaskEdit(taskItem) {
    let span = taskItem.querySelector(".task-text");
    let editBtn = taskItem.querySelector(".edit-btn");
    let input = document.createElement("input");
    input.classList.add("edit-input");
    input.value = span.textContent;
    span.replaceWith(input);
    editBtn.textContent = "Save";
}
function saveTaskEdit(taskItem) {
    let input = taskItem.querySelector(".edit-input");
    let editBtn = taskItem.querySelector(".edit-btn");
    if (input.value.trim() === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }
    let newSpan = document.createElement("span");
    newSpan.classList.add("task-text");
    newSpan.textContent = input.value.trim();
    input.replaceWith(newSpan);
    editBtn.textContent = "Edit";
    taskMessage.textContent = "";
    let s = storedTasks.find(t => t.id === taskItem.dataset.taskId);
    if (s) { s.text = newSpan.textContent; saveToStorage(); }
}
function removeTask(taskItem) {
    storedTasks = storedTasks.filter(t => t.id!== taskItem.dataset.taskId);
    saveToStorage();
    taskItem.remove();
    updateTaskCounts();
}
function updateTaskCounts() {
    let tasks = taskList.querySelectorAll(".task-item");
    let pending = 0, completed = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].dataset.state === "completed") completed++;
        else pending++;
    }
    totalCount.textContent = tasks.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}
function handleTaskListClick(event) {
    let taskItem = event.target.closest(".task-item");
    if (!taskItem) return;
    if (event.target.matches(".complete-btn")) toggleTaskComplete(taskItem);
    if (event.target.matches(".edit-btn")) {
        if (event.target.textContent === "Edit") beginTaskEdit(taskItem);
        else saveTaskEdit(taskItem);
    }
    if (event.target.matches(".remove-btn")) removeTask(taskItem);
}
function loadSampleTasks() {
    let tasks = ["Review DOM selectors", "Practice createElement", "Study event delegation"];
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < tasks.length; i++) {
        taskCounter++;
        let id = "task-" + taskCounter;
        let el = createTaskElement(tasks[i], id);
        fragment.appendChild(el);
        storedTasks.push({ id: id, text: tasks[i], state: "pending" });
    }
    taskList.appendChild(fragment);
    saveToStorage();
    updateTaskCounts();
}
addTaskBtn.addEventListener("click", function() { addTask(taskInput.value); });
taskList.addEventListener("click", handleTaskListClick);
loadSamplesBtn.addEventListener("click", function() { loadSampleTasks(); });

// Load saved tasks on page load
storedTasks.forEach(t => {
    let el = createTaskElement(t.text, t.id);
    el.dataset.state = t.state;
    if (t.state === "completed") el.classList.add("completed");
    taskList.appendChild(el);
    if (parseInt(t.id.split("-")[1]) > taskCounter) taskCounter = parseInt(t.id.split("-")[1]);
});
updateTaskCounts();
