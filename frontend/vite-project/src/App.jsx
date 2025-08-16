import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import ProductsPage from './pages/ProductsPage'; // Create this next
import TreatmentsPage from './pages/TreatmentsPage'; // Create this next

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ServiceSelectionPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;