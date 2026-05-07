import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Slack,
  MoonStar,
  SunMoon,
  CircleUser,
  UserCog,
  Plus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { taskContext } from "../App";

const Navbar = () => {
  const navigate = useNavigate();
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("user");
  const [email, setEmail] = useState("user@gmail.com");

  const { userName, userEmail } = useContext(taskContext);

  // handle menubar
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  // closes menu when clicked anywhere
  useEffect(() => {
    const handler = (e) => {
      if (menuref.current && !menuref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // handle logout
  const handleLogout = () => {
    toast.success("Logged Out!");
    setMenuOpen(false);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    try {
      setName(userName);
      setEmail(userEmail);
    } catch (error) {
      setName("user");
      setEmail("user@gamil.com");
    }
  }, []);

  return (
    <div className="text-white fixed top-0 w-[100%] z-30 bg-blue-800 dark:bg-blue-950">
      <nav className="flex justify-around lg:justify-between  py-2.5 w-[80%] m-auto ml-15 lg:m-auto md:m-auto md:justify-between ">
        <div>
          <NavLink to="/layout/allTasks">
            <Slack className="text-orange-600 inline-block" size={45} />{" "}
            <span className="font-semibold text-2xl ml-0.5 italic">
              TaskManager
            </span>
          </NavLink>
        </div>

        <div>
          <ul className="flex justify-center items-center flex-row space-x-5">
            {/* profile button */}
            <li
              ref={menuref}
              className="relative hover:text-purple-300 transition-colors duration-300"
            >
              <button onClick={handleMenuToggle}>
                <CircleUser size={45} />
              </button>

              {/* Dropdown of profile button */}
              {menuOpen && (
                <ul className="absolute top-10 right-0 w-56 bg-white rounded-2xl text-black shadow-lg px-2">
                  <li className="p-3 border-b">
                    <p className="text-lg font-medium">{userName}</p>
                    <p className="text-md text-gray-500">{userEmail}</p>
                  </li>
                  <li className="p-2 my-2 hover:bg-gray-100 rounded-b-xl">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/layout/profile");
                      }}
                      className="w-full flex items-center gap-2"
                      role="menuitem"
                      title="profile setting"
                    >
                      <UserCog /> Profile
                    </button>
                  </li>
                  <li className="p-2 my-1 hover:bg-gray-100 rounded-b-xl">
                    <button onClick={handleLogout} className="">
                      <LogOut className="text-red-800 inline text-center size-4.5 text-sm" />
                      &nbsp; Log Out
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
