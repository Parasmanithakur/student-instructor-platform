import './App.css'
import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import StudentDashboard from './Dashboards/StudentDashboard';
import { useEffect, useState } from 'react';
import InstructorDashboard from './Dashboards/InstructorDashboard';
import Leaderboard from './Dashboards/LeaderDashboard';

function App() {
const [user, setUser] = useState(null);

  // On load, try restoring user from localStorage
  function restoreUserFromToken() {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ username: decoded.sub, role: decoded.role, token });
        }
      } catch (e) {
        // Handle invalid token or decoding error
        setUser(null);
      }
    }
  }

  useEffect(() => {
    restoreUserFromToken();
  }, []);
  

    const handleLogout = () => {
      localStorage.removeItem("jwt_token");
      setUser(null);
             window.location.pathname = "/";
    };

    // Redirect to "/" if user logs out
  
  return (
  <div className="app-container">
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/student/dashboard/*" element={<StudentDashboard user={user} handleLogout={handleLogout} setUser={restoreUserFromToken} />} />
        <Route path="/instructor/dashboard/*" element={<InstructorDashboard user={user} handleLogout={handleLogout} setUser={restoreUserFromToken} />}/>  
       
        <Route path="/student/leaderboard" element={<Leaderboard user={user}/>} />
      </Routes>
    </Router>

    </div>
  )
}

export default App
