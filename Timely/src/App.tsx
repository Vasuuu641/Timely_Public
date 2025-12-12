
import Login from './route/(frontend)/login/Loginn';
import Register from './route/(frontend)/register/Register'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './route/(frontend)/dashboard/Dashboard';
import Home from './route/(frontend)/home/Home';
import Schedule from './route/(frontend)/schedule/Schedule';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDarkMode } = useTheme();
  
  return (
    <main className={`main-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Schedule" element={<Schedule/>}/>
          {/* Add more routes as needed */}
        </Routes>
    </Router>
    </main>
  );
}

export default App;