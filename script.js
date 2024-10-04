const initialState = localStorage.getItem("Todos")
  ? JSON.parse(localStorage.getItem("Todos"))
  : [];

let todos = initialState;
const inputField = document.getElementById("inputField");
const todosList = document.getElementById("todos-list");
const addButton = document.getElementById("addButton");
let activeTodo = {};
let mode = "add";

// Add this function to show notifications
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  // Show the notification
  notification.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    notification.style.display = "none"; // Optional: hide completely after fading out
  }, 3000);
}

function changeState(id) {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) return;

  todo.done = !todo.done;
  renderTodoList(todos);
  setLocal(todos);
}

function disabledButton() {
  if (inputField.value.trim().length !== 0) {
    addButton.removeAttribute("disabled");
  } else {
    addButton.setAttribute("disabled", true);
  }
}

function setLocal(todoList) {
  localStorage.setItem("Todos", JSON.stringify(todoList));
}

let currentEditId = null;

function editTodo(id) {
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    inputField.value = todo.title;
    mode = "edit";
    currentEditId = id;
    addButton.textContent = "Edit";
    addButton.style.backgroundColor = "#4ef59d"; // Update button color for "Update"
  }
}

function addTodo() {
  const inputFieldValue = inputField.value.trim();

  if (inputFieldValue) {
    if (mode === "edit") {
      // Update existing todo
      todos = todos.map((todo) =>
        todo.id === currentEditId ? { ...todo, title: inputFieldValue } : todo
      );
      showNotification("The task was successfully updated");
    } else {
      // Add new todo
      let newTodo = {
        id: Date.now(),
        title: inputFieldValue,
        done: false,
      };
      todos.push(newTodo);
      showNotification("The task was successfully added");
    }

    setLocal(todos);
    inputField.value = "";
    renderTodoList(todos);

    // Reset to default mode after updating
    mode = "add";
    currentEditId = null;
    addButton.textContent = "Add";
    addButton.style.backgroundColor = "#fb4d8d"; // Reset button color for "Add"
  }
}

function deleteTodo(id) {
  // Confirmation before deletion
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );
  if (confirmDelete) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodoList(todos);
    setLocal(todos);
    showNotification("The task was successfully deleted");
  }
}

function renderTodoList(todos) {
  todosList.innerHTML = "";

  if (todos.length === 0) {
    todosList.innerHTML = `<div class="no-tasks">No tasks available.<br/><br/> Add some!</div>`;
    document.querySelector(".no-tasks").style.cssText =
      "font-weight: bold; color: #a8a3ba; text-align: center; font-size: 1.25rem; padding: 1.5rem;";
    return;
  }

  todos.forEach((item) => {
    const todoItem = document.createElement("div");
    todoItem.className = "todos-todo";
    const iconSrc = item.done
      ? "./Assets/check-circle.svg"
      : "./Assets/circle.svg";

    todoItem.innerHTML = `
        <div class="todos-form_icon">
          <img
            src="${iconSrc}"
            alt="Icon"
            class="icon-svg"
            id="todos-todo_icon"
            onclick="changeState(${item.id})"
          />
        </div>
        <div class="todos-todo_text" style="text-decoration: ${
          item.done ? "line-through" : "none"
        }; color: ${item.done ? "#a8a3ba" : "white"};">
          ${item.title}
        </div>
        <div class="todos-todo_cta">
          <div class="todos-todo_cta-edit">
            <img src="./Assets/edit.svg" alt="edit icon" onclick="editTodo(${
              item.id
            })"/>
          </div>
          <div class="todos-todo_cta-delete">
            <img src="./Assets/trash-2.svg" alt="delete icon" onclick="deleteTodo(${
              item.id
            })"/>
          </div>
        </div>
      `;
    todosList.appendChild(todoItem);
  });
}

renderTodoList(initialState);
