document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTaskButton = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');
    const todosLeft = document.getElementById('items-left');
    // const completedBtn = li.querySelector('.complete-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // console.log(tasks);

    // const itemsLeft = tasks.filter((todo) => !todo.completed).length;

    tasks.forEach((task) => renderTask(task));

    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        // console.log(taskText);
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = '';
        // console.log(tasks);
    });

    const itemsLeftElement = document.getElementById('items-left');
    function updateItemsLeft() {
        const itemsLeft = tasks.filter((todo) => !todo.completed).length;
        itemsLeftElement.textContent = `${itemsLeft} items left`;
    }

    updateItemsLeft();

    function renderTask(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `   
        <div class="flex drag flex-1 py-1.5 px-3.5">  
        <div class="flex gap-2.5 items-center justify-center"  >
                            <button  
                                class="complete-btn w-4 h-4 rounded-full border">
                             <div class="${task.completed ? '' : 'hidden'} 
                             gradiant w-4 h-4 rounded-full border flex items-center justify-center">
                                <img src="./images/icon-check.svg" alt="" class=" "/>
                                </div>

                                 </button>
                            <p class="todo-text dark:text-[var(--Purple-300)]">${task.text}</p>
        </div>
                        <button class="delete-btn flex flex-2  ">
                            <img src="./images/icon-cross.svg" alt="" class="w-4 h-4 text-gray-600" />
                        </button>
                        </div>
         
        `;
        li.draggable = true;

        todoList.appendChild(li);
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter((t) => t.id !== task.id);

            saveTasks(); //update Local
            li.remove(); //remove from the page
        });
        // console.log(tasks);
        // console.log(deleteBtn);

        const completedBtn = li.querySelector('.complete-btn');
        const checkMark = completedBtn.querySelector('div');
        completedBtn.addEventListener('click', () => {
            task.completed = !task.completed;

            // li.classList.toggle('complete-btn');

            checkMark.classList.toggle('hidden');

            console.log(completedBtn);
            saveTasks();
            renderTasks(tasks);
            updateItemsLeft();
        });
    }

    function renderTasks(taskArray) {
        todoList.innerHTML = '';

        taskArray.forEach((task) => {
            renderTask(task);
        });
    }

    document.getElementById('all-btn').addEventListener('click', () => {
        renderTasks(tasks);
        // console.log(renderTasks(tasks));
    });

    document.getElementById('active-btn').addEventListener('click', () => {
        const activeTasks = tasks.filter((task) => !task.completed);
        renderTasks(activeTasks);
    });
    document.getElementById('completed-btn').addEventListener('click', () => {
        const completedTasks = tasks.filter((task) => task.completed);

        renderTasks(completedTasks);
    });

    document.getElementById('clear-completed').addEventListener('click', () => {
        tasks = tasks.filter((task) => !task.completed);

        saveTasks();
        renderTasks(tasks);
        updateItemsLeft();
    });

    const list = document.getElementById('todo-list');

    let draggedItem = null;

    // When dragging starts
    list.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.target.classList.add('dragging');
        saveTasks();
    });

    // When dragging ends
    list.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        draggedItem = null;
        saveTasks();
    });

    // Allow dropping by preventing default
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
        saveTasks();
    });

    // Helper function to find the position to insert
    function getDragAfterElement(container, y) {
        const draggableElements = [
            ...container.querySelectorAll('li:not(.dragging)'),
        ];
        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY },
            saveTasks(),
        ).element;

        renderTask();
    }

    // script.js

    // Get HTML root element
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');

    // Load saved theme from localStorage
    if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    // Toggle theme on button click
    toggleBtn.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            toggleBtn.innerHTML = ` 
            
            <img src="./images/icon-moon.svg" alt="moon icon" />`;
            localStorage.theme = 'light';
        } else {
            html.classList.add('dark');
            localStorage.theme = 'dark';
            toggleBtn.innerHTML = ` <img src="./images/icon-sun.svg" alt="sun icon" />`;
        }
    });

    saveTasks();

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
