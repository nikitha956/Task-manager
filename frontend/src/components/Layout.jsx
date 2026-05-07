import React, { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import AddTask from "./AddTask";
import Dashboard from "./Dashboard";

const Layout = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  return (
    <div className="relative">
      <Navbar />
      <Dashboard />
      {/* pass the modal controller to children */}
      {/* <Outlet context={{ openAddTaskModal: () => setShowAddTask(true) }} /> */}

      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 relative w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => {
                setShowAddTask(false);
                setIsEditing(false);
                setTaskToEdit(null);
              }}
            >
              ✖
            </button>

            {/* Show Edit or Add form based on isEditing flag */}
            {isEditing ? (
              <EditTask
                closeModal={() => setShowAddTask(false)}
                taskToEdit={taskToEdit}
              />
            ) : (
              <AddTask closeModal={() => setShowAddTask(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
