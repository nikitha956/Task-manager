import React from 'react'
import { useContext } from 'react';
import { taskContext } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeleteTask = () => {
      const {
    setTasks,
    setPendingTasks,
    setCompletedTasks,
    confirmDelete,
    setConfirmDelete,
    taskToDelete,
    setTaskToDelete,
  } = useContext(taskContext);

  // server URL 
  const url = "https://task-manager-backend-srzi.onrender.com"
  
  // delete Task functionality
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You can't Delete task . please Login");
    const task = taskToDelete;
    if (!task) return toast.error("No task to Delete !!");

    try {
      const taskId = task._id;
      const response = await axios.delete(
        `${url}/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("task Deleted!" ,{
        autoClose:1000,
      });

      //  updating all tasks, completeTasks, pendingTasks
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setPendingTasks((prev) => prev.filter((t) => t._id !== taskId));
      setCompletedTasks((prev) => prev.filter((t) => t._id !== taskId));

      setConfirmDelete(false);
      setTaskToDelete([]);
      console.log(response.data.title);
    } catch (error) {
      toast.error("Error while deleting Task!");
      setConfirmDelete(false);
      setTaskToDelete(null);
      console.log(error.message);
    }
  };

  const handleCancelDelete = async () => {
    setConfirmDelete(false);
    setTaskToDelete(null);
  }
  return (
    <div>
      {/* delete confirmation dialogue box*/}
      {confirmDelete && taskToDelete && (
        <div className="fixed inset-0  bg-black/50 flex justify-center items-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg z-50">
            <h2 className="text-lg font-bold mb-4 bg-gray-100 pl-2 rounded-lg">Confirm Delete</h2>
            <p className="mb-1">Are you sure you want to delete this task?</p>
            <p className="text-center font-semibold mb-4">
              {taskToDelete?.title ? `"${taskToDelete.title}"` : "?"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-400"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-3  rounded-lg hover:bg-red-600 ring-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeleteTask
