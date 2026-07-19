const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const container = document.getElementById("container")

const newTaskList = document.createElement("ul")
newTaskList.setAttribute("id", "taskList")
container.appendChild(newTaskList)

const addItem = function (e) {
  e.preventDefault();
  if (taskInput.value.trim()) {
    const newTaskItem = document.createElement("li");
    const newTaskText = document.createElement("span");
    const newDeleteBtn = document.createElement("button");

    newTaskText.textContent = taskInput.value;
    newTaskItem.classList.add("task-item");
    newTaskText.classList.add("task-text");

    newDeleteBtn.textContent = "x";
    newDeleteBtn.classList.add("delete-btn");

    newTaskItem.append(newTaskText, newDeleteBtn);
    newTaskList.appendChild(newTaskItem);
    taskInput.value = "";
  }
};

addTaskBtn.addEventListener("click", addItem);

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addItem(e);
  }
});

newTaskList.addEventListener("click", function (e) {
  const clickedLi = e.target.closest("li");

  if (e.target.classList.contains("delete-btn")) {
    clickedLi.remove();
  } else if (clickedLi) {
    clickedLi.classList.toggle("completed");
  }
});
