// Dashboard.tsx
import React from 'react';
import NavBar from '../navBar/NavBaR';
import './Dashboard.css'; // Assuming you have a CSS file for styling
import Cards from './Cards'; // Importing the Cards component
import { useTheme } from '../../../context/ThemeContext'; // Importing the theme context

const Dashboard: React.FC = () => {

  const {isDarkMode} = useTheme(); // Using the theme context to get the current theme

return(
  <div className={`dashboard-layout ${isDarkMode ? 'dark' : 'light'}`}>
    <NavBar />

   <div className="dashboard-content">
    <div className="dashboard-header">
      <h1>Welcome to Timely!</h1>
      <p>Your all-in-one productivity and scheduling companion</p>
    </div>
      <Cards /> 
      <div className='quick-actions'>
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-button">Create Task</button>
          <button className="action-button">Start Timer</button>
          <button className="action-button">New Note</button>  
        </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;
