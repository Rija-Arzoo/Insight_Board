import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "../hooks/useTasks";

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [activity, setActivity] = useState(() => {
    return JSON.parse(localStorage.getItem("activity")) || [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("activity", JSON.stringify(activity));
  }, [activity]);

  const logActivity = (event) => {
    const entry = {
      id: uuidv4(),
      at: new Date().toISOString(),
      ...event,
    };
    setActivity((prev) => [entry, ...prev].slice(0, 100));
  };

  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks((prev) => [...prev, newTask]);
    logActivity({
      type: "task.created",
      message: `Created task “${newTask.title}”`,
      taskId: newTask.id,
    });
  };

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    if (updates?.title) {
      logActivity({
        type: "task.updated",
        message: `Updated task title to “${updates.title}”`,
        taskId: id,
      });
    } else {
      logActivity({
        type: "task.updated",
        message: "Updated task details",
        taskId: id,
      });
    }
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    logActivity({
      type: "task.deleted",
      message: "Deleted a task",
      taskId: id,
    });
  };

  const changeStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    logActivity({
      type: "task.status",
      message: `Changed status to ${status}`,
      taskId: id,
    });
  };

  const getTasksForUser = (email, role) => {
    if (role === "manager") return tasks;
    return tasks.filter((t) => t.assignedTo === email);
  };

  const value = {
    tasks,
    activity,
    addTask,
    updateTask,
    deleteTask,
    changeStatus,
    getTasksForUser,
  };

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  );
};