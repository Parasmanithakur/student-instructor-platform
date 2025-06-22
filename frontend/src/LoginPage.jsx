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
import { loginUser } from './Utils/ApiUtils';
import { jwtDecode } from "jwt-decode";
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const navigate = useNavigate();
    const handleLogin = async () => {
        const res = await loginUser({ username, password, role });
        console.log(res);
        if (res?.token) {
            localStorage.setItem("jwt_token", res?.token);

           const decoded = jwtDecode(res?.token);
            const user = {
                username: decoded.sub,
                role: decoded.role,
                token:decoded.token,
            };
            onLogin(user);
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
