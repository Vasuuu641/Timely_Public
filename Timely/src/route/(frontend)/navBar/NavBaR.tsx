import { MdHome, MdOutlinePlaylistAddCheck, MdQuiz, MdOutlineTimer, MdSettings, MdOutlineLogout } from "react-icons/md";
import { GrScheduleNew , GrNotes} from "react-icons/gr";
import { HiOutlineLightBulb } from "react-icons/hi";
import './NavBar.css'; // Assuming you have a CSS file for styling
import { MdWbSunny, MdNightlightRound } from "react-icons/md";
import { useTheme } from "../../../context/ThemeContext";

const NavBar = () => {
  const {isDarkMode, toggleDarkMode} = useTheme();

  return (
    <nav className={`sidebar ${isDarkMode ? 'dark' : 'light'}`}>
        <div className='sidebar-header'>Timely</div>
      <ul className = "nav-list">
        <li><a href="/dashboard"><MdHome className = "nav-icon"></MdHome>Dashboard</a></li>
        <li><a href="/schedule"><GrScheduleNew className = "nav-icon"></GrScheduleNew>Schedule</a></li>
        <li><a href="/to-do-list"><MdOutlinePlaylistAddCheck className = "nav-icon"></MdOutlinePlaylistAddCheck>To-Do-List</a></li>
        <li><a href= "/notes"><GrNotes className = "nav-icon"></GrNotes>Notes</a></li>
        <li><a href= "/quizzes"><MdQuiz className = "nav-icon"></MdQuiz>Quizzes</a></li>
        <li><a href= "/pomodoro-timer"><MdOutlineTimer className = "nav-icon"></MdOutlineTimer>Pomodoro-Timer</a></li>
        <li><a href= "/daily-review"><HiOutlineLightBulb className='nav-icon'></HiOutlineLightBulb>Daily-Review</a></li>
        <li><a href= "/login"><MdOutlineLogout className='nav-icon'></MdOutlineLogout >log out</a></li>
        <li><a href= "/Settings"><MdSettings className='nav-icon'></MdSettings>Settings</a></li>
      </ul>

      <div className = "sidebar-footer">
        <div className="theme-section">
            <span>Theme :</span>

            <button
                className="theme-toggle-btn"
                onClick={toggleDarkMode}
            >
              {isDarkMode? (
                <MdWbSunny className="theme-icon" />
              ) : (
                <MdNightlightRound className="theme-icon" />
              )}
            </button>
          </div>
        <div className="user-id">
            {/*User ID can be dynamically set here*/}
        </div>
        </div>
    </nav>
  );
};

export default NavBar;