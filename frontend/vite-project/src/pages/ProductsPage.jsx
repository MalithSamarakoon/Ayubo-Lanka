// frontend/vite-project/src/pages/ProductsPage.jsx
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Our Ayurvedic Products</Typography>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </div>
  );
}