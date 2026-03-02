"use client";

import React, { useState, useEffect } from "react";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse saved tasks");
      }
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode, isMounted]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      const newTaskObject: Task = {
        id: crypto.randomUUID(),
        text: newTask,
        completed: false,
      };
      setTasks((prev) => [...prev, newTaskObject]);
      setNewTask("");
    }
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function toggleCompleted(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function moveUp(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveDown(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  function toggleTheme() {
    setIsDarkMode((prev) => !prev);
  }

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <div
        className={`w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl backdrop-blur-sm border rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800/60 border-gray-700/50"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-widest uppercase flex-1 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <span className="text-emerald-400">To</span>
            <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              —
            </span>
            <span className={isDarkMode ? "text-white" : "text-gray-900"}>
              Do
            </span>
            <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              —
            </span>
            <span className="text-emerald-400">List</span>
          </h1>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
              isDarkMode
                ? "bg-gray-700/60 hover:bg-gray-600/60"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
          <input
            type="text"
            placeholder="Enter new to-do..."
            onChange={handleInputChange}
            value={newTask}
            onKeyDown={(e: React.KeyboardEvent) =>
              e.key === "Enter" && addTask()
            }
            className={`flex-1 border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
              isDarkMode
                ? "bg-gray-700/60 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <button
            onClick={addTask}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-150 shadow-lg shadow-emerald-900/40 w-full sm:w-auto"
          >
            + Add Task
          </button>
        </div>

        {tasks.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm">
            <div
              className={`flex-1 border rounded-lg px-3 py-2 text-center ${
                isDarkMode
                  ? "bg-gray-700/40 border-gray-600/40"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Total:{" "}
              </span>
              <span
                className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {tasks.length}
              </span>
            </div>
            <div
              className={`flex-1 border rounded-lg px-3 py-2 text-center ${
                isDarkMode
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Active:{" "}
              </span>
              <span className="text-emerald-400 font-bold">{activeCount}</span>
            </div>
            <div
              className={`flex-1 border rounded-lg px-3 py-2 text-center ${
                isDarkMode
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Done:{" "}
              </span>
              <span className="text-blue-400 font-bold">{completedCount}</span>
            </div>
          </div>
        )}

        <ol
          className={`space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 ${
            isDarkMode
              ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          }`}
        >
          {tasks.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">📝</div>
              <p
                className={`text-sm sm:text-base ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                No tasks yet. Add one above!
              </p>
            </div>
          )}

          {tasks.map((task, index) => (
            <li
              key={task.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border rounded-xl px-3 sm:px-4 py-3 group transition-all duration-150 ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/40 hover:border-emerald-500/40 hover:bg-gray-700/70"
                  : "bg-white border-gray-200 hover:border-emerald-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span
                  className={`hidden sm:flex text-xs font-bold text-emerald-400 rounded-lg w-7 h-7 items-center justify-center shrink-0 ${
                    isDarkMode ? "bg-emerald-400/10" : "bg-emerald-100"
                  }`}
                >
                  {index + 1}
                </span>

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id)}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer shrink-0 mt-0.5 sm:mt-0 ${
                    isDarkMode
                      ? "border-gray-500 focus:ring-offset-gray-800"
                      : "border-gray-300 focus:ring-offset-white"
                  }`}
                />

                <span
                  className={`flex-1 text-sm sm:text-base break-words ${
                    task.completed
                      ? isDarkMode
                        ? "line-through text-gray-500"
                        : "line-through text-gray-400"
                      : isDarkMode
                        ? "text-white"
                        : "text-gray-900"
                  }`}
                >
                  {task.text}
                </span>
              </div>

              <div className="flex gap-1.5 justify-end sm:justify-start shrink-0">
                <button
                  onClick={() => moveUp(task.id)}
                  disabled={index === 0}
                  title="Move up"
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg disabled:opacity-25 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-150 active:scale-90 ${
                    isDarkMode
                      ? "bg-gray-600/60 hover:bg-blue-500/80 text-white"
                      : "bg-gray-100 hover:bg-blue-500 text-gray-700 hover:text-white"
                  }`}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(task.id)}
                  disabled={index === tasks.length - 1}
                  title="Move down"
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg disabled:opacity-25 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-150 active:scale-90 ${
                    isDarkMode
                      ? "bg-gray-600/60 hover:bg-blue-500/80 text-white"
                      : "bg-gray-100 hover:bg-blue-500 text-gray-700 hover:text-white"
                  }`}
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete"
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-sm sm:text-base transition-all duration-150 active:scale-90 ${
                    isDarkMode
                      ? "bg-gray-600/60 hover:bg-red-500/80 text-white"
                      : "bg-gray-100 hover:bg-red-500 text-gray-700 hover:text-white"
                  }`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>

        {tasks.length > 0 && (
          <div
            className={`mt-4 sm:mt-6 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDarkMode ? "border-gray-700/50" : "border-gray-200"
            }`}
          >
            <p
              className={`text-xs sm:text-sm order-2 sm:order-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
            >
              {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
            </p>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className={`order-1 sm:order-2 w-full sm:w-auto border text-xs sm:text-sm px-4 py-2 rounded-lg transition-all duration-150 ${
                  isDarkMode
                    ? "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400"
                    : "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                }`}
              >
                Clear Completed ({completedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
