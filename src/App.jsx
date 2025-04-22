// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// TodoItem component handles each task
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <label>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
      </label>
      <button onClick={() => onDelete(todo.id)} className="delete">✕</button>
    </div>
  );
}

// App component
function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [errorQuote, setErrorQuote] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch quote');
        return res.json();
      })
      .then(data => {
        setQuote(data);
        setLoadingQuote(false);
      })
      .catch(err => {
        setErrorQuote(err.message);
        setLoadingQuote(false);
      });
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo = { id: Date.now(), text: newTodo.trim(), completed: false };
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <main className="app">
      <h1>To-Do List</h1>

      <section className="quote">
        {loadingQuote && 'Loading quote...'}
        {errorQuote && <span className="error">{errorQuote}</span>}
        {quote && <blockquote>"{quote.content}" — {quote.author}</blockquote>}
      </section>

      <section className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={addTodo}>Add</button>
      </section>

      <section className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </section>

      <section className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
        ))}
      </section>
    </main>
  );
}

export default App;
