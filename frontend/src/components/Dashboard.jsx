import React, { useState, useContext, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { taskContext } from "../App";
import AddTask from "./AddTask";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const {
    tasks,
    setTasks,
    pendingTasks,
    setPendingTasks,
    completedTasks,
    setCompletedTasks,
    loading,
    setLoading,
    setError,
    setUserName,
    setUserEmail,
    setImage,
    theme,
  } = useContext(taskContext);

  const [open, setOpen] = useState(false);
  const url = "https://task-manager-backend-srzi.onrender.com";

  // get user details on every refresh
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // extract token from local storage
        const response = await axios.get(url + "/api/user/myDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setUserName(response.data.user.name); // set name
          setUserEmail(response.data.user.email); // set email
          setImage(response.data.user?.imageUrl); // set image url
        }
      } catch (error) {
        setError("Error while fetching tasks");
        console.log("Error fetching tasks", error);
      }
    };

    getUserDetails();
  }, []);

  //  get all task on every refresh
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please wait.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(url + "/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const fetchedTasks = response.data.tasks;
          setTasks(fetchedTasks);
          setCompletedTasks(fetchedTasks.filter((task) => task.completed));
          setPendingTasks(fetchedTasks.filter((task) => !task.completed));
        }
      } catch (error) {
        setError("Error while fetching tasks");
        console.log("Error fetching tasks", error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const completionRate =
    tasks.length > 0
      ? ((completedTasks.length / tasks.length) * 100).toFixed(2)
      : "0.00";

  return (
    <div
      className={`flex min-h-screen ${
        theme === "dark"
          ? "bg-slate-800"
          : "bg-[linear-gradient(90deg,_rgba(240,240,240,1)_0%,_rgba(255,237,237,1)_100%)]"
      }`}
    >
      {/* Fixed Sidebar */}
      <div>
        <SideBar />
      </div>

      {/* Main Content with left margin to avoid overlap */}
      <div className="lg:w-[80%] absolute top-16 right-0 w-[100%] ">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Task Overview
            </h2>

            {/* Modal */}
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-green-800 text-white lg:text-lg md:text-lg px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition">
                  Add New Task <Plus size={25} />
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl z-1000">
                  <Dialog.Title className="text-lg font-semibold mb-2 text-center">
                    Add New Task
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-600 mb-4 text-center">
                    {/* Fill in the details below to create a new task. */}
                  </Dialog.Description>

                  <AddTask setOpen={setOpen} />

                  <Dialog.Close
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    aria-label="Close"
                  >
                    ✕
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:gap-4 gap-2">
            <StatCard
              title="Total Tasks"
              value={loading ? "..." : tasks.length}
            />
            <StatCard
              title="Completed"
              value={loading ? "..." : completedTasks.length}
            />
            <StatCard
              title="Pending"
              value={loading ? "..." : pendingTasks.length}
            />
            <StatCard title="Completion Rate" value={`${completionRate}%`} />
          </div>
        </div>

        {/* Tasks layout*/}
        <div
          className={`lg:p-6 md:p-6 p-2 ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-[linear-gradient(90deg,_rgba(240,240,240,1)_0%,_rgba(255,237,237,1)_100%)]"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Reusable Status Card component
const StatCard = ({ title, value }) => (
  <div className="bg-white lg:p-4 p-2.5 rounded-lg shadow-md shadow-slate-700 text-center dark:bg-slate-100">
    <h3 className="text-md text-gray-600">{title}</h3>
    <p className="lg:text-2xl md:text-2xl text-xl font-bold text-gray-800">
      {value}
    </p>
  </div>
);

export default Dashboard;
