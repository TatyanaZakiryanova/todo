"use strict";
class Todo {
    constructor(id, task, completed = false) {
        this.id = id;
        this.task = task;
        this.completed = completed;
    }
    markCompleted() {
        this.completed = true;
    }
    markIncomplete() {
        this.completed = false;
    }
}
class TodoApp {
    constructor() {
        this.todos = [];
    }
    addTodo(task) {
        const newTodo = new Todo(this.todos.length + 1, task);
        this.todos.push(newTodo);
        this.render();
    }
    removeTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.render();
    }
    markAllCompleted() {
        this.todos.forEach((todo) => todo.markCompleted());
        this.render();
        alert('All tasks are completed');
    }
    render() {
        const todoListContainer = document.getElementById('todo-list');
        if (todoListContainer) {
            todoListContainer.innerHTML = '';
            this.todos.forEach((todo) => {
                const todoElement = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        todo.markCompleted();
                    }
                    else {
                        todo.markIncomplete();
                    }
                    this.render();
                });
                todoElement.appendChild(checkbox);
                const taskText = document.createElement('span');
                taskText.textContent = todo.task;
                if (todo.completed) {
                    taskText.style.textDecoration = 'line-through';
                }
                todoElement.appendChild(taskText);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.onclick = () => {
                    this.removeTodo(todo.id);
                };
                todoElement.appendChild(deleteButton);
                todoListContainer.appendChild(todoElement);
            });
        }
    }
}
const todoApp = new TodoApp();
const addButton = document.getElementById('add-btn');
const taskInput = document.getElementById('task-input');
const markAllButton = document.getElementById('mark-all-btn');
if (addButton && taskInput) {
    addButton.addEventListener('click', () => {
        const task = taskInput.value.trim();
        if (task) {
            todoApp.addTodo(task);
            taskInput.value = '';
        }
    });
}
if (markAllButton) {
    markAllButton.addEventListener('click', () => {
        todoApp.markAllCompleted();
    });
}
