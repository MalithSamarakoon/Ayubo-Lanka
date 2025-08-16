import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ayurvedaBg from '../assets/ayurveda-bg.jpg'; // Ensure this image exists in your assets

// Custom Ayurveda-themed colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Ayurvedic green
    },
    secondary: {
      main: '#ed6c02', // Ayurvedic orange
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
    h2: {
      fontWeight: 600,
      fontSize: '3rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
  },
});

export default function ServiceSelectionPage() {
  const navigate = useNavigate();
  const muiTheme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          background: `linear-gradient(rgba(0, 0, 0, 0.5), url(${ayurvedaBg}) center/cover no-repeat`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              mb: 4,
            }}
          >
            Welcome to Sanjeewanie Ayurveda
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 6,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Discover the ancient wisdom of Ayurveda for modern wellness
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                px: 5, 
                py: 2, 
                fontSize: '1.1rem',
                borderRadius: '8px',
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/products')}
            >
              Explore Products
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary"
              size="large" 
              sx={{ 
                px: 5, 
                py: 2,
                fontSize: '1.1rem',
                borderRadius: '8px',
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/treatments')}
            >
              Discover Treatments
            </Button>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 8, 
              opacity: 0.9,
              textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
            }}
          >
            © {new Date().getFullYear()} Sanjeewanie Ayurveda. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}