import React, { useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isLoading, error } = useAuthStore();

  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between p-5 font-medium">
      <Link to="/">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          className="w-47"
          alt="Logo"
        />
      </Link>

      {/* Navigation Links */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/home" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p>HOME</p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink to="/Collection" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p>COLLECTION</p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink to="/Doctor" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p>DOCTOR</p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink to="/About" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p>ABOUT</p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink to="/Contact" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p>CONTACT</p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-6">
        <img
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
        />

        {/* Profile Dropdown */}
        <div className="group relative">
          <img
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              {isAuthenticated ? (
                <>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => navigate("/dashboard")}
                  >
                    My Profile
                  </p>

                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => navigate("/orders")}
                  >
                    Orders
                  </p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </>
              ) : (
                <p
                  className="cursor-pointer hover:text-black"
                  onClick={() => navigate("/login")}
                >
                  Login
                </p>
              )}
            </div>
          </div>
        </div>

        <Link to="/Cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {/* Add cart count here if needed */}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/Collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/About"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/Contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
