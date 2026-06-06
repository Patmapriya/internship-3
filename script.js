// ===== STATE =====
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

// ===== ELEMENTS =====
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const filters = document.querySelector(".filters");

// ===== SAVE TO LOCAL STORAGE =====
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ===== RENDER =====
function renderTodos() {
  list.innerHTML = "";

  let filtered = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span>${todo.text}</span>
      <div class="actions">
        <button data-action="toggle">✔</button>
        <button data-action="edit">✏</button>
        <button data-action="delete">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// ===== ADD TODO =====
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  saveTodos();
  renderTodos();
}

// ===== EVENT: ADD =====
addBtn.addEventListener("click", addTodo);

input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTodo();
});

// ===== EVENT DELEGATION (CRUD) =====
list.addEventListener("click", e => {
  const action = e.target.dataset.action;
  if (!action) return;

  const li = e.target.closest("li");
  const id = Number(li.dataset.id);

  if (action === "toggle") {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  if (action === "delete") {
    todos = todos.filter(todo => todo.id !== id);
  }

  if (action === "edit") {
    const newText = prompt("Edit task:");
    if (newText) {
      todos = todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      );
    }
  }

  saveTodos();
  renderTodos();
});

// ===== FILTERS =====
filters.addEventListener("click", e => {
  if (e.target.tagName !== "BUTTON") return;

  filter = e.target.dataset.filter;
  renderTodos();
});

// ===== INIT =====
renderTodos();