import { useState, useCallback, useEffect, useRef } from "react";
import { Shell } from "./components/Shell";
import type { Todo, Filter } from "./types";

const STORAGE_KEY = "todo-app-items";

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  }, [input]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <Shell filter={filter} onFilterChange={setFilter} counts={counts}>
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {filter === "all" && "All Tasks"}
          {filter === "active" && "Active Tasks"}
          {filter === "completed" && "Completed Tasks"}
        </h1>

        {/* Add input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="flex gap-3 mb-6"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-[var(--radius-btn)] border text-sm outline-none"
            style={{
              borderColor: "var(--color-line)",
              background: "var(--color-panel)",
              color: "var(--color-ink)",
            }}
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-[var(--radius-btn)] text-sm font-semibold text-white shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            Add
          </button>
        </form>

        {/* Todo list */}
        <div className="flex flex-col gap-2">
          {filtered.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] border"
              style={{ borderColor: "var(--color-line)" }}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
                style={{
                  borderColor: todo.completed
                    ? "var(--color-accent)"
                    : "var(--color-line)",
                  background: todo.completed
                    ? "var(--color-accent)"
                    : "transparent",
                }}
              >
                {todo.completed && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className="flex-1 text-sm select-text"
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed
                    ? "var(--color-muted)"
                    : "var(--color-ink)",
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                style={{ color: "var(--color-muted)" }}
                onPointerEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onPointerLeave={(e) => (e.currentTarget.style.opacity = "")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p
            className="text-center py-12 text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            {filter === "all" && "No tasks yet. Add one above!"}
            {filter === "active" && "No active tasks. Nice work!"}
            {filter === "completed" && "No completed tasks yet."}
          </p>
        )}

        {/* Clear completed */}
        {counts.completed > 0 && (
          <button
            onClick={clearCompleted}
            className="mt-4 text-xs hover:underline"
            style={{ color: "var(--color-muted)" }}
          >
            Clear {counts.completed} completed{" "}
            {counts.completed === 1 ? "task" : "tasks"}
          </button>
        )}
      </div>
    </Shell>
  );
}
