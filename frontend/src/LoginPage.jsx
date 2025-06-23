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
import { Link, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { loginUser } from './Utils/ApiUtils';
import { jwtDecode } from "jwt-decode";

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            const res = await loginUser({ username, password, role });
            console.log(res);
            
            if (res?.message && !res.token) {
                setLoginErrorMessage(res.message || "Login failed");
                setLoginError(true);
                return;
            }
            
            if (res?.token) {
                localStorage.setItem("jwt_token", res?.token);
                const decoded = jwtDecode(res?.token);
                const user = {
                    username: decoded.sub,
                    role: decoded.role,
                    token: decoded.token,
                };
                onLogin(user);
                if (role === "student") navigate("/student/dashboard");
                else if (role === "instructor") navigate("/instructor/dashboard");
            } else {
                setLoginErrorMessage("Login failed. Please try again.");
                setLoginError(true);
            }
        } catch (error) {
            setLoginErrorMessage("An error occurred during login.");
            setLoginError(true);
            console.error("Login error:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                    {/* Error Alert */}
                    <Collapse in={loginError}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setLoginError(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {loginErrorMessage}
                        </Alert>
                    </Collapse>

                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        error={loginError}
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={loginError}
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

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleLogin}
                        fullWidth
                        size="large"
                    >
                        Login
                    </Button>
                    <Typography variant="body2" align="center">
                        Don't have an account?{' '}
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