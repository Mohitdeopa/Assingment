document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('tasks');
    const addTaskForm = document.getElementById('add-task-form');
    const editTaskForm = document.getElementById('edit-task-form');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.getElementsByClassName('close')[0];

    // Fetch and display tasks
    const fetchTasks = async () => {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <small>Due: ${task.dueDate}</small>
                </div>
                <div>
                    <button onclick="editTask(${task.id})">View/Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    // Add a new task
    addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addTaskForm);
        const newTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('dueDate')
        };
        await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        addTaskForm.reset();
        fetchTasks();
    });

    // Edit a task
    editTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editTaskForm);
        const updatedTask = {
            id: formData.get('id'),
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('dueDate')
        };
        await fetch(`/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });
        taskModal.style.display = 'none';
        fetchTasks();
    });

    // Delete a task
    window.deleteTask = async (id) => {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    };

    // Edit task
    window.editTask = async (id) => {
        const response = await fetch(`/tasks/${id}`);
        const task = await response.json();
        document.getElementById('edit-id').value = task.id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description;
        document.getElementById('edit-dueDate').value = task.dueDate;
        taskModal.style.display = 'block';
    };

    // Close the modal
    closeModal.onclick = () => {
        taskModal.style.display = 'none';
    };

    // Close the modal if clicked outside
    window.onclick = (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    };

    fetchTasks();
});