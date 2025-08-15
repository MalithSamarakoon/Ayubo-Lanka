import React, { createContext } from "react";
import { doctors } from "../assets/frontend_assets/assets"; // Correct to actual path!

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const value = { doctors };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
