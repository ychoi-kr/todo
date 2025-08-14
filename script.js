class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        
        this.todoInput = document.getElementById('todoInput');
        this.addButton = document.getElementById('addButton');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.init();
    }
    
    init() {
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        this.render();
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (text === '') return;
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const text = document.createElement('span');
            text.className = 'todo-text';
            text.textContent = todo.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '削除';
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteBtn);
            
            this.todoList.appendChild(li);
        });
        
        this.updateCount();
    }
    
    updateCount() {
        const activeCount = this.todos.filter(todo => !todo.completed).length;
        this.todoCount.textContent = activeCount;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});