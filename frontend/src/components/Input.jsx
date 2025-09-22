import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ icon: Icon, type = "text", togglePassword = false, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = togglePassword && isPassword ? (show ? "text" : "password") : type;

  const toggle = () => setShow((s) => !s);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className="relative mb-6">
      {/* Left icon */}
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="size-5 text-green-500" />
        </div>
      )}

      {/* Input field */}
      <input
        {...props}
        type={inputType}
        className={`w-full py-3 rounded-lg border border-gray-300 
                    bg-gray-50 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                    shadow-sm
                    ${Icon ? "pl-10" : "pl-4"}
                    ${togglePassword && isPassword ? "pr-10" : "pr-4"}`}
      />

      {/* Right eye toggle*/}
      {togglePassword && isPassword && (
        <span
          role="button"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={onKey}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center pr-3
                     text-gray-500 hover:text-gray-700 cursor-pointer
                     bg-transparent select-none outline-none"
          style={{ background: "transparent" }} 
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </span>
      )}
    </div>
  );
};

export default Input;
