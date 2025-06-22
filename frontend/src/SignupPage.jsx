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
  Paper,Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { registerUser } from './Utils/ApiUtils';

const SignupPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    const res = await registerUser(form);
    console.log("ress",res);
    if (res?.error) {
      const errorData =  res;
      setError(errorData.message || "Signup failed");
      return;
    }
    const data = await res;
setSuccess(true)

  };
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
  return (
    <Container maxWidth="sm">{error && (
  <Alert severity="error" onClose={() => setError("")}>
    {error}
  </Alert>
)}

{success && (
  <Alert severity="success" onClose={() => setSuccess("")}>
    {success}
  </Alert>
)}
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={form.username}
            onChange={handleChange}
          />

          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={form.password}
            onChange={handleChange}
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Signup As</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Signup As"
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleSignup}>
            Signup
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