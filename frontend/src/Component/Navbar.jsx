import React, { useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ayuboLogo from "../assets/frontend_assets/ayubologo.png";

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
    <div className="flex items-center justify-between p-5 font-medium bg-gradient-to-r from-green-50 to-emerald-100 border-b border-emerald-200 shadow-sm">
      <Link to="/">
        <img
          src={ayuboLogo}
          className="w-10 cursor-pointer object-contain"
          alt="Logo"
        />
      </Link>

      {/* Navigation Links */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/home" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p
                className={`transition-colors ${
                  isActive ? "text-emerald-700 font-semibold" : ""
                }`}
              >
                HOME
              </p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-emerald-600 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>

        <NavLink to="/Collection" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p
                className={`transition-colors ${
                  isActive ? "text-emerald-700 font-semibold" : ""
                }`}
              >
                COLLECTION
              </p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-emerald-600 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>

        <NavLink to="/Doctor" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p
                className={`transition-colors ${
                  isActive ? "text-emerald-700 font-semibold" : ""
                }`}
              >
                DOCTOR
              </p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-emerald-600 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>

        <NavLink to="/support" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p
                className={`transition-colors ${
                  isActive ? "text-emerald-700 font-semibold" : ""
                }`}
              >
                SUPPORT
              </p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-emerald-600 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>

        <NavLink to="/About" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p
                className={`transition-colors ${
                  isActive ? "text-emerald-700 font-semibold" : ""
                }`}
              >
                ABOUT
              </p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-emerald-600 ${
                  isActive ? "block" : "hidden"
                }`}
              />
            </>
          )}
        </NavLink>

        <NavLink to="/Contact" className="flex flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <p
                className={`transition-colors ${
                  isActive ? "text-emerald-700 font-semibold" : ""
                }`}
              >
                CONTACT
              </p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-emerald-600 ${
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
            onClick={() => {
              const authed =
                !!user || String(isAuthenticated).toLowerCase() === "true";
              if (!authed) navigate("/login");
            }}
          />

          {(!!user || String(isAuthenticated).toLowerCase() === "true") && (
            <div className="hidden group-hover:block absolute right-0 top-full pt-3 z-40">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white/90 backdrop-blur-md text-gray-700 rounded-lg shadow-lg border border-emerald-200">
                <p
                  className="cursor-pointer hover:text-emerald-700"
                  onClick={() => navigate("/dashboard")}
                >
                  My Profile
                </p>
                <p
                  className="cursor-pointer hover:text-emerald-700"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </p>
                <p
                  className="cursor-pointer hover:text-emerald-700"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/Cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="hidden absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-emerald-700 text-white aspect-square rounded-full text-[8px]"></p>
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
        className={`fixed inset-y-0 right-0 bg-gradient-to-b from-green-50 to-emerald-100 z-50 transition-all duration-300 overflow-hidden ${
          visible
            ? "w-full sm:w-80 pointer-events-auto"
            : "w-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col text-gray-700 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 border-b border-emerald-200"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p className="font-medium">Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-emerald-100 hover:bg-emerald-50"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-emerald-100 hover:bg-emerald-50"
            to="/Collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-emerald-100 hover:bg-emerald-50"
            to="/About"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-emerald-100 hover:bg-emerald-50"
            to="/support"
          >
            SUPPORT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-emerald-100 hover:bg-emerald-50"
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
