document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display tasks when the page loads
    fetchTasks();
  
    // Add event listener to the form for adding a new task
    const addTaskForm = document.getElementById('add-task-form');
    addTaskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const taskInput = document.getElementById('task-input');
      const newTask = taskInput.value;
      if (newTask) {
        addTask(newTask);
        taskInput.value = ''; // Clear the input field after submission
      }
    });
  });
  
  // Fetch all tasks from the backend
  function fetchTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
          const listItem = document.createElement('li');
          listItem.textContent = `${task.task} ${task.completed ? '(Completed)' : ''}`;
          
          // Add a delete button
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => deleteTask(task.id));
          
          listItem.appendChild(deleteButton);
          taskList.appendChild(listItem);
          setTimeout(() => listItem.classList.add('show'), 50);
        });
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }
  
  // Add a new task by sending a POST request to the backend
  function addTask(task) {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
      .then(response => response.json())
      .then(newTask => {
        fetchTasks(); // Refresh the task list after adding
      })
      .catch(error => console.error('Error adding task:', error));
  }
  
  // Delete a task by sending a DELETE request to the backend
  function deleteTask(id) {
    fetch(`/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        fetchTasks(); // Refresh the task list after deletion
      })
      .catch(error => console.error('Error deleting task:', error));
  }
  