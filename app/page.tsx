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

  // Fix hydration mismatch by waiting for client mount
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
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

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

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-widest text-white mb-6 sm:mb-8 uppercase">
          <span className="text-emerald-400">To</span>
          <span className="text-gray-400 mx-1">—</span>
          <span className="text-white">Do</span>
          <span className="text-gray-400 mx-1">—</span>
          <span className="text-emerald-400">List</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
          <input
            type="text"
            placeholder="Enter new to-do..."
            onChange={handleInputChange}
            value={newTask}
            onKeyDown={(e: React.KeyboardEvent) =>
              e.key === "Enter" && addTask()
            }
            className="flex-1 bg-gray-700/60 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
            <div className="flex-1 bg-gray-700/40 border border-gray-600/40 rounded-lg px-3 py-2 text-center">
              <span className="text-gray-400">Total: </span>
              <span className="text-white font-bold">{tasks.length}</span>
            </div>
            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-center">
              <span className="text-gray-400">Active: </span>
              <span className="text-emerald-400 font-bold">{activeCount}</span>
            </div>
            <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-center">
              <span className="text-gray-400">Done: </span>
              <span className="text-blue-400 font-bold">{completedCount}</span>
            </div>
          </div>
        )}

        <ol className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {tasks.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-sm sm:text-base">
                No tasks yet. Add one above!
              </p>
            </div>
          )}

          {tasks.map((task, index) => (
            <li
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gray-700/50 border border-gray-600/40 rounded-xl px-3 sm:px-4 py-3 group hover:border-emerald-500/40 hover:bg-gray-700/70 transition-all duration-150"
            >
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="hidden sm:flex text-xs font-bold text-emerald-400 bg-emerald-400/10 rounded-lg w-7 h-7 items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                />

                <span
                  className={`flex-1 text-sm sm:text-base break-words ${
                    task.completed ? "line-through text-gray-500" : "text-white"
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
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-600/60 hover:bg-blue-500/80 disabled:opacity-25 disabled:cursor-not-allowed text-white text-sm sm:text-base transition-all duration-150 active:scale-90"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(task.id)}
                  disabled={index === tasks.length - 1}
                  title="Move down"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-600/60 hover:bg-blue-500/80 disabled:opacity-25 disabled:cursor-not-allowed text-white text-sm sm:text-base transition-all duration-150 active:scale-90"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-600/60 hover:bg-red-500/80 text-white text-sm sm:text-base transition-all duration-150 active:scale-90"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>

        {tasks.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs sm:text-sm order-2 sm:order-1">
              {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
            </p>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="order-1 sm:order-2 w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs sm:text-sm px-4 py-2 rounded-lg transition-all duration-150"
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
