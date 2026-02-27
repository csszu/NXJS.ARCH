// ===============================
// Simple To-Do List & Utilities
// ===============================

// Array to store tasks
let tasks = [];

// Add new task
function addTask(title) {
  if (!title || title.trim() === "") {
    console.log("⚠️ Cannot add empty task!");
    return;
  }
  const task = {
    id: Date.now(),
    title: title.trim(),
    done: false
  };
  tasks.push(task);
  console.log(`✅ Task added: ${task.title}`);
}

// Toggle task completion
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    console.log(`🔄 Task "${task.title}" marked as ${task.done ? "done ✅" : "not done ❌"}`);
  } else {
    console.log("⚠️ Task not found!");
  }
}

// Remove a task
function removeTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    console.log(`🗑️ Task removed: ${tasks[index].title}`);
    tasks.splice(index, 1);
  } else {
    console.log("⚠️ Task not found!");
  }
}

// Show all tasks
function showTasks() {
  console.log("\n=== 📋 Current Tasks ===");
  if (tasks.length === 0) {
    console.log("No tasks available.");
    return;
  }
  tasks.forEach((task, i) => {
    console.log(`${i + 1}. ${task.title} [${task.done ? "✅" : "❌"}]`);
  });
  console.log("=========================\n");
}

// Example usage
addTask("Learn JavaScript");
addTask("Build a project");
addTask("Push code to GitHub");

showTasks();

toggleTask(tasks[0].id); // toggle first task
removeTask(tasks[1].id); // remove second task

showTasks();

// Utility: Random quote generator
const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "In order to be irreplaceable, one must always be different.",
  "Experience is the name everyone gives to their mistakes.",
  "JavaScript is the duct tape of the Internet."
];

function randomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  console.log(`💡 Quote: "${q}"`);
}

randomQuote();
