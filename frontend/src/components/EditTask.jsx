import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { taskContext } from "../App";

const EditTask = ({ setOpen, taskToEdit }) => {
  const { setTasks, setPendingTasks, setCompletedTasks } =
    useContext(taskContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  //server url
  const url = "https://task-manager-backend-srzi.onrender.com";

  // Prevent rendering if taskToEdit is not ready
  if (!taskToEdit) return null;

  useEffect(() => {
    setTitle(taskToEdit.title || "");
    setDescription(taskToEdit.description || "");
    setPriority(taskToEdit.priority || "Low");
    setDueDate(taskToEdit.dueDate?.split("T")[0] || "");
    setCompleted(taskToEdit.completed ?? false);
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token missing! Please log in.");
      return;
    }

    const taskId = taskToEdit._id;
    try {
      const response = await axios.put(
        `${url}/api/tasks/${taskId}`,
        {
          title,
          description,
          priority,
          dueDate,
          completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTask = response.data.updateTask;
      setOpen(false); // Close modal

      // Replace in main task list
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );

      // Re-separate based on completion
      setCompletedTasks((prev) => {
        const filtered = prev.filter((task) => task._id !== updatedTask._id);
        return updatedTask.completed ? [...filtered, updatedTask] : filtered;
      });

      setPendingTasks((prev) => {
        const filtered = prev.filter((task) => task._id !== updatedTask._id);
        return !updatedTask.completed ? [...filtered, updatedTask] : filtered;
      });

      toast.success("task Upated!", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("Failed to edit task", {
        autoClose: 1000,
      });
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4} // You can increase rows for more initial height
          className="px-3 py-2 border border-gray-300 rounded-md bg-slate-50 text-sm resize-y overflow-auto focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Due Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Completed */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Completed
        </label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={completed === true}
              onChange={() => setCompleted(true)}
            />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={completed === false}
              onChange={() => setCompleted(false)}
            />
            No
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
      >
        Update Task
      </button>
    </form>
  );
};

export default EditTask;
