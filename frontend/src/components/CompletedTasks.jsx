import React, { useContext, useState, useEffect } from "react";
import { taskContext } from "../App";
import { SquarePen, Trash2, ListFilter } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import EditTask from "./EditTask";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteTask from "./DeleteTask";

const completedTasks = () => {
  const {
    completedTasks,
    error,
    loading,
    taskToEdit,
    setTaskToEdit,
    open,
    setOpen,
    setConfirmDelete,
    setTaskToDelete,
    theme,
  } = useContext(taskContext);

  const [filteredTask, setFilteredTask] = useState([]);
  const [filter, setFilter] = useState("");

  //  for filtering task based on user preference
  useEffect(() => {
    if (filter) {
      const taskFiltered = completedTasks.filter(
        (task) => task.priority === filter
      );
      setFilteredTask(taskFiltered);
    } else {
      setFilteredTask(completedTasks);
    }
  }, [filter, completedTasks]);

  // till task fetching not completed in App.jxs , show loading...
  if (loading)
    return (
      <div className="p-4 flex justify-center items-center h-[100vh]">
        Loading Tasks.....
      </div>
    );

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div
      className={`lg:p-8 md:p-6 p-3 mx-auto rounded-lg ${
        theme === "dark"
          ? "bg-slate-700"
          : "bg-[linear-gradient(90deg,_rgba(240,240,240,1)_0%,_rgba(255,237,237,1)_100%)]"
      }`}
    >
      <div className="flex justify-between flex-wrap">
        <h1 className="text-2xl text-red-600 mb-4 dark:text-red-100">
          Completed Tasks
        </h1>
        <div className="mb-4 dark:text-black">
          <label className="mr-2 font-medium">
            <ListFilter className="inline-block dark:text-white" size={28} />
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`border px-2 py-1 rounded dark:bg-slate-600 dark:text-white`}
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <p className="text-center text-lg text-gray-500 italic mt-4">
          You have not completed any tasks yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {/* using map to show all completed task passed from APP.jsx as context API */}
          {filteredTask.map((task) => (
            <li
              key={task._id}
              className={`p-4 rounded shadow-md shadow-slate-700 border border-slate-600 bg-white dark:bg-gray-900`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold dark:text-gray-100">
                  {task.title}
                </h2>
                <span
                  className={`text-md px-2 py-1 rounded-full ${
                    task.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <p className="text-gray-700 text-lg dark:text-gray-200">
                {task.description}
              </p>
              <div className="text-md mt-2 dark:text-gray-300">
                Priority:{" "}
                <p
                  className={`${
                    task.priority === "High"
                      ? "bg-red-400 text-white"
                      : task.priority === "Medium"
                      ? "bg-yellow-200 text-black"
                      : "bg-green-600"
                  } 
                          inline-block px-1.5 py-0.4 rounded-lg text-sm`}
                >
                  {task.priority}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created At: {new Date(task.createdAt).toLocaleString()}
                </p>

                <div className="flex">
                  {/*  task deletion button */}
                  <button
                    className="hover:text-red-600 text-slate-600"
                    onClick={() => {
                      setTaskToDelete(task);
                      setConfirmDelete(true);
                    }}
                  >
                    <Trash2 size={22} className= "dark:text-white" />
                  </button>

                  <button
                    className="text-gray-600 text-sm px-4 py-2 rounded-xl flex items-center gap-2 hover:text-blue-700 transition"
                    onClick={() => {
                      setTaskToEdit(task);
                      setOpen(true);
                    }}
                  >
                    <SquarePen size={22} className= "dark:text-white" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Dialog rendered outside loop to avoid aria-hidden/focus bugs */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl z-50">
            <Dialog.Title className="text-lg font-semibold mb-2 text-center">
              Edit Task
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mb-4 text-center">
              {/* Modify the details of your task below. */}
            </Dialog.Description>

            {taskToEdit && (
              <EditTask setOpen={setOpen} taskToEdit={taskToEdit} />
            )}

            <Dialog.Close
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ✕
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* delete task component */}
      <DeleteTask />
    </div>
  );
};

export default completedTasks;
