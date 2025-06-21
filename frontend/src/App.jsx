import './App.css'
import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import StudentDashboard from './Dashboards/StudentDashboard';

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/student/*" element={<StudentDashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
