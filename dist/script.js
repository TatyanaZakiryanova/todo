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
        this.loadTodos();
    }
    loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
            this.render();
        }
    }
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    addTodo(task) {
        const newTodo = new Todo(this.todos.length + 1, task);
        this.todos.push(newTodo);
        this.saveTodos();
        this.render();
    }
    removeTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.saveTodos();
        this.render();
    }
    markAllCompleted() {
        this.todos.forEach((todo) => todo.markCompleted());
        this.saveTodos();
        this.render();
        alert('All tasks are completed');
    }
    render() {
        const todoListContainer = document.getElementById('todo-list');
        if (todoListContainer) {
            todoListContainer.innerHTML = '';
            this.todos.forEach((todo, index) => {
                const todoElement = document.createElement('li');
                todoElement.draggable = true;
                //присваивает атрибут data-index каждому li
                todoElement.dataset.index = index.toString();
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
                    this.saveTodos();
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
                // Drag-and-drop события
                todoElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
                todoElement.addEventListener('dragover', (e) => this.handleDragOver(e));
                todoElement.addEventListener('drop', (e) => this.handleDrop(e));
                todoElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
                todoListContainer.appendChild(todoElement);
            });
        }
    }
    handleDragStart(e) {
        var _a;
        //получение элемента, с которого началось перетаскивание
        const target = e.target;
        if (target && target.dataset.index) {
            //сохранение индекса перетаскиваемого элемента в dataTransfer
            (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', target.dataset.index);
            target.classList.add('dragging');
        }
    }
    handleDragOver(e) {
        e.preventDefault();
        //получение элемента, над которым в данный момент находится перетаскиваемый элемент
        const target = e.target;
        if (target && target.dataset.index) {
            //выделение рамкой возможного места для drop
            target.style.border = '2px dashed #ccc';
        }
    }
    handleDrop(e) {
        var _a, _b;
        e.preventDefault();
        //индекс элемента, который перетащили
        const fromIndex = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
        const target = e.target;
        //индекс элемента, на который перетащили
        const toIndex = (_b = target.closest('li')) === null || _b === void 0 ? void 0 : _b.dataset.index;
        if (fromIndex && toIndex && fromIndex !== toIndex) {
            const from = parseInt(fromIndex, 10);
            const to = parseInt(toIndex, 10);
            //удаление элемента из массива todos по индексу from
            //и вставка по индексу to
            const [movedTodo] = this.todos.splice(from, 1);
            this.todos.splice(to, 0, movedTodo);
            this.saveTodos();
            this.render();
        }
    }
    handleDragEnd(e) {
        const target = e.target;
        if (target) {
            target.classList.remove('dragging');
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
