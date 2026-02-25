"use client";

import React, { useState, useEffect } from "react";

export default function Page() {
  // Fix: Properly type the state as string array
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
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
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      // Fix: Properly type the previous tasks
      setTasks((prevTasks: string[]) => [...prevTasks, newTask]);
      setNewTask("");
    }
  }

  function deleteTask(index: number) {
    const updatedTasks = tasks.filter((_: string, i: number) => i !== index);
    setTasks(updatedTasks);
  }

  function moveUp(index: number) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveDown(index: number) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center tracking-widest text-white mb-8 uppercase">
          <span className="text-emerald-400">To</span>
          <span className="text-gray-400 mx-1">—</span>
          <span className="text-white">Do</span>
          <span className="text-gray-400 mx-1">—</span>
          <span className="text-emerald-400">List</span>
        </h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter new to-do..."
            onChange={handleInputChange}
            value={newTask}
            onKeyDown={(e: React.KeyboardEvent) =>
              e.key === "Enter" && addTask()
            }
            className="flex-1 bg-gray-700/60 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
          <button
            onClick={addTask}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all duration-150 shadow-lg shadow-emerald-900/40"
          >
            + Add
          </button>
        </div>

        <ol className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">
              No tasks yet. Add one above!
            </p>
          )}
          {tasks.map((task: string, index: number) => (
            <li
              key={index}
              className="flex items-center gap-3 bg-gray-700/50 border border-gray-600/40 rounded-xl px-4 py-3 group hover:border-emerald-500/40 hover:bg-gray-700/70 transition-all duration-150"
            >
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
                {index + 1}
              </span>

              <span className="flex-1 text-white font-medium text-sm truncate">
                {task}
              </span>

              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Move up"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600/60 hover:bg-blue-500/80 disabled:opacity-25 disabled:cursor-not-allowed text-white text-xs transition-all duration-150 active:scale-90"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === tasks.length - 1}
                  title="Move down"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600/60 hover:bg-blue-500/80 disabled:opacity-25 disabled:cursor-not-allowed text-white text-xs transition-all duration-150 active:scale-90"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  title="Delete"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600/60 hover:bg-red-500/80 text-white text-xs transition-all duration-150 active:scale-90"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>

        {tasks.length > 0 && (
          <p className="text-center text-gray-500 text-xs mt-6">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} remaining
          </p>
        )}
      </div>
    </div>
  );
}
