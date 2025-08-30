import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import ProductDashboard from './pages/ProductDashboard'

function App() {
  return (
    <div>
      <Routes>
           <Route path='/product-dashboard' element={<ProductDashboard />}/>
      </Routes>
    </div>
  )
}

export default App
