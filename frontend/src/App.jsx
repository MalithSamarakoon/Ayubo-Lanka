import React from "react";
import { Routes, Route } from "react-router-dom";
import Orderform from "./Pages/Orderform";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Orderform />} />
    </Routes>
  );
};

export default App;

