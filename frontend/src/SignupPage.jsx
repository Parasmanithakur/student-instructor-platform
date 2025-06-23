import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Paper,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { registerUser } from './Utils/ApiUtils';

const SignupPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      return 'Please enter a valid email address (e.g., user@example.com)';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 7) {
      return 'Password must be at least 7 characters long';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Password must contain at least one letter';
    }
    return null;
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate email
      const emailError = validateEmail(form.email);
      if (emailError) {
        setError(emailError);
        return;
      }

      // Validate password match
      if (form.password !== form.confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      // Validate password strength
      const passwordError = validatePassword(form.password);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      const res = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role
      });
      
      if (res?.error) {
        setError(res.message || "Signup failed. Please try again.");
        return;
      }

      setSuccess(res?.message || "Signup successful! You can now login.");
      
      // Clear form on successful signup
      setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
      });
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>

        {/* Error Alert */}
        <Collapse in={!!error}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Collapse>

        {/* Success Alert */}
        <Collapse in={!!success}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setSuccess(null)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        </Collapse>

        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={form.username}
            onChange={handleChange}
            error={!!error}
            required
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={form.email}
            onChange={handleChange}
            error={!!error}
            helperText="Must be a valid email (e.g., user@example.com)"
            required
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={form.password}
            onChange={handleChange}
            error={!!error}
            helperText="Must be at least 7 characters with at least 1 number and 1 letter"
            required
          />

          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!error}
            required
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Signup As</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Signup As"
              onChange={handleChange}
              required
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSignup}
            disabled={loading}
            fullWidth
            size="large"
          >
            {loading ? 'Signing Up...' : 'Signup'}
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;