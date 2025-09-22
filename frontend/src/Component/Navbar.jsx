import React, { useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NavItem = ({ to, label }) => (
  <NavLink to={to} className="flex flex-col items-center gap-1">
    {({ isActive }) => (
      <>
        <p className="uppercase">{label}</p>
        <hr
          className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
            isActive ? "block" : "hidden"
          }`}
        />
      </>
    )}
  </NavLink>
);

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between p-5 font-medium">
      {/* Logo */}
      <Link to="/">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          className="w-47"
          alt="Logo"
        />
      </Link>

      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavItem to="/home" label="Home" />
        <NavItem to="/collection" label="Collection" />
        <NavItem to="/doctor" label="Doctor" />
        <NavItem to="/support" label="Support" /> {/* ← added */}
        <NavItem to="/about" label="About" />
        <NavItem to="/contact" label="Contact" />
      </ul>

      {/* Right icons */}
      <div className="flex items-center gap-6">
        <img src={assets.search_icon} className="w-5 cursor-pointer" alt="Search" />

        {/* Profile dropdown */}
        <div className="group relative">
          <img className="w-5 cursor-pointer" src={assets.profile_icon} alt="Profile" />
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

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]" />
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/home">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/doctor">
            DOCTOR
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/support">
            SUPPORT
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
