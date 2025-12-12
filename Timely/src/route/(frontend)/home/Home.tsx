import { Link } from 'react-router-dom';
import './Home.css';
import { useTheme } from '../../../context/ThemeContext';

function Home() {
  const { isDarkMode} = useTheme();
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Welcome to Timely!</h1>
      <p>
        Timely is your all-in-one productivity and scheduling companion.<br />
        Organize tasks, manage to-do lists, set reminders, and boost your focus—all in one simple, unified app.
      </p>
      <div className="home-actions">
        <Link to="/login" className="simple-link">Login</Link>
        <Link to="/register" className="simple-link">Register</Link>
      </div>
      <section className="about-section">
        <h2>About Timely</h2>
        <p>
          Timely helps you stay organized and productive by offering features like task scheduling, to-do lists, notes, quizzes, and a pomodoro timer. 
          Whether you’re a student, professional, or anyone looking to manage their time better, Timely is designed for you!
        </p>
      </section>
    </div>
  );
}

export default Home;