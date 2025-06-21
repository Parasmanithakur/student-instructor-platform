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
  Paper
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      if (role === "student") navigate("/student/dashboard");
      else if (role === "instructor") navigate("/instructor/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Login As</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Login As"
              onChange={e => setRole(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
           <Typography variant="body2" align="center">
                      Dont have an account?{' '}
                      <Link component={RouterLink} to="/signup">
                        Signup here
                      </Link>
                    </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
