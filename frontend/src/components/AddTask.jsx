import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { taskContext } from "../App";

const AddTask = ({ setOpen }) => {
  const { setTasks, setPendingTasks, setCompletedTasks } =
    useContext(taskContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const url = "https://task-manager-backend-srzi.onrender.com"; // serber url

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)

    if (!title || !description) {
      toast.error("Please fill all fields", {
        autoClose: 1000,
      });
      setSubmitting(false)
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("token missing! Please log in.");
      setSubmitting(false)
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/tasks",
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

      setOpen(false); // closing add Task box
      setSubmitting(false)

      const newTask = response.data.task; // newly created task

      // adding new Task to all task
      setTasks((prevTasks) => [...prevTasks, newTask]);

      // add new task to completed or pending
      if (newTask.completed)
        setCompletedTasks((prevTasks) => [...prevTasks, newTask]);
      else 
        setPendingTasks((prevTasks) => [...prevTasks, newTask]);

      toast.success("Task Added!", {
        autoClose: 1000,
      });

      // reset values
      setTitle("");
      setDescription("");
      setPriority("Low");
      setDueDate("");
      setCompleted(false);
    } catch (error) {
      toast.error("Failed to add task", {
        autoClose: 1000,
      });
      console.error(error.response?.message || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title || ""}
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
          value={description || ""}
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
          value={priority || "Low"}
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
          value={dueDate || " "}
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
        disabled = {submitting}
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTask;
