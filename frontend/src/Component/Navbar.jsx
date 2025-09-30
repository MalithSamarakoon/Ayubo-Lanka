// src/Component/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { useAuthStore } from "../store/authStore";
import { getCartCount, onCartChange } from "../utils/cartCounter";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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

      {/* Links */}
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

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
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

        <NavLink to="/doctor" className="flex flex-col items-center gap-1">
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

        <NavLink to="/about" className="flex flex-col items-center gap-1">
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

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
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
        <img src={assets.search_icon} className="w-5 cursor-pointer" alt="Search" />

        {/* Profile */}
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
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
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
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />

          <p className="hidden absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]"></p>
        </Link>

        {/* Mobile menu toggle */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 bg-white z-50 transition-all duration-300 overflow-hidden ${
          visible
            ? "w-full sm:w-80 pointer-events-auto"
            : "w-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
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

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/home">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
