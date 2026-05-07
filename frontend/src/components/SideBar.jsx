import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  CircleCheckBig,
  TrendingUp,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useContext } from "react";
import { taskContext } from "../App";
import userImg from "../assets/userImg.png";
import ProfilePic from "./Profile/ProfilePic";

const SideBar = () => {
  // using Context to get user details to show on sidebar such as name, image
  const { userName, image, setOpenImage, theme, setTheme } =
    useContext(taskContext);

  const [hamburger, setHamburger] = useState(false);

  // retain theme when we refresh
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setTheme(theme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "");
    }
  }, [theme]);

  // changing theme (dark, light)
  const handleMode = () => {
    setTheme((prev) => (prev === "" ? "dark" : ""));
  };

  return (
    <>
      {/* Hamburger Button - visible only on small screens */}
      <div className="lg:hidden fixed top-3 left-3 z-[50]">
        <button
          onClick={() => setHamburger((prev) => !prev)}
          className=" text-white p-1"
        >
          {hamburger ? (
            <X
              className={`mr-2 ${theme === "" ? "text-black" : "text-white"}`}
              size={35}
            />
          ) : (
            <Menu size={35} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen lg:w-[20%]  bg-white shadow-md z-40 md:px-10 md:w-[45%] px-4 lg:px-4 w-[70%] pt-30 flex-col gap-10 transition-transform duration-300 flex lg:z-10  dark:bg-slate-900 dark:text-white
        ${hamburger ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:flex`}
      >
        <div className="flex flex-col items-center">
          <div className=" p-1 rounded-full border-4 w-40 h-40">
            <img
              src={image === "" ? userImg : image}
              alt="userImage"
              className="rounded-full object-cover h-[100%] border w-[100%]"
              onClick={() => setOpenImage(true)}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mb-4 mt-0.5  dark:text-white">
            Hi, {userName || "user"} 👋
          </h1>
        </div>

        <div className="flex flex-col w-full max-w-[300px] gap-3 mx-auto">
          <NavLink
            to="/layout/allTasks"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-md font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard className="inline-block mx-1.5" /> Dashboard
          </NavLink>

          <NavLink
            to="/layout/completedTasks"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-md font-medium transition ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <CircleCheckBig className="inline-block mx-1.5" />
            Completed
          </NavLink>

          <NavLink
            to="/layout/pendingTasks"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-md font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <TrendingUp className="inline-block mx-1.5" /> Pending
          </NavLink>
        </div>
        <button
          className={`${theme == "" ? "text-black" : "text-white"}`}
          onClick={handleMode}
        >
          <div className="relative w-20 h-8 rounded-full bg-gray-300 shadow-inner transition duration-300 ease-in-out dark:bg-slate-600 ">
        <div
          className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
            theme ? "left-[calc(100%-1.75rem)]" : "left-1"
          }`}
        ></div>
      </div>
        </button>
      </div>
      <ProfilePic />
    </>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm px-3 py-2 rounded-md transition ${
        isActive
          ? "bg-green-100 text-green-800 font-semibold"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`
    }
  >
    {label}
  </NavLink>
);

export default SideBar;
