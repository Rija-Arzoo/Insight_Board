import { useContext, createContext } from "react";

export const TaskContext = createContext(null);

export const useTasks = () => {

  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
};