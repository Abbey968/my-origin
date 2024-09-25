const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Connect to SQLite3 database
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to SQLite3 database.');
  }
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Serve static files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list all tasks
app.get('/tasks', (req, res) => {
  const query = `SELECT id, task, completed FROM tasks`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving tasks:', err);
      res.status(500).json({ error: 'Failed to retrieve tasks' });
    } else {
      res.json(rows);
    }
  });
});

// POST route to add a new task
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  const query = `INSERT INTO tasks (task, completed) VALUES (?, 0)`;

  db.run(query, [task], function(err) {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).json({ error: 'Failed to add task' });
    } else {
      res.json({ id: this.lastID, task, completed: 0 });
    }
  });
});

// DELETE route to remove a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM tasks WHERE id = ?`;

  db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Failed to delete task' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted' });
    }
  });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
