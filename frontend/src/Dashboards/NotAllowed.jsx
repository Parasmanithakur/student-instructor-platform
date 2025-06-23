import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  useTheme 
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Login as LoginIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotAllowed = ({role}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ color: theme.palette.error.main, mb: 2 }}>
          <ErrorIcon sx={{ fontSize: 60 }} />
        </Box>  
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Access Restricted
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          You don't have permission to access this page. Please log in with a {role =="instructor"?"instructor":"student"} account.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ px: 4 }}
          >
            Go to Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ px: 4 }}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotAllowed;