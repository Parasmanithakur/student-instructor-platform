import './App.css'
import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import StudentDashboard from './Dashboards/StudentDashboard';

function App() {
const [user, setUser] = useState(null);

  // On load, try restoring user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ username: decoded.sub, role: decoded.role, token });
        } else {
          localStorage.removeItem("jwt_token"); // expired
        }
      } catch {
        localStorage.removeItem("jwt_token"); // bad token
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/student/dashboard/*" element={<StudentDashboard user={user} />} />
      </Routes>
    </Router>

    </>
  )
}

export default App
