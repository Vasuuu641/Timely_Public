import { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import './Register.css'

const SimpleRegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  interface UserData {
    email: string;
    password: string;
    username: string;
  }

  interface ErrorData {
    statusCode?: number;
    message?: string | string[];
  }

  interface NewUser {
    username: string;
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match!");
      alert("Passwords do not match!"); 
      return;
    }

    const userData: UserData = {
      email: email,
      password: password,
      username: username,
    }
    
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if(!response.ok){
        const errorData: ErrorData = await response.json();
        console.error('Registration failed: ', errorData);
        alert(`Registration Failed: ${errorData.message || 'Unknown error'}`);

        if(errorData.statusCode === 400 && errorData.message){
          if(Array.isArray(errorData.message)){
            alert('validation errors: \n' + errorData.message.join('\n'));
          }else{
            alert('validation error: ' + errorData.message);
          }
        }
        }else{
          const newUser: NewUser = await response.json();
          console.log('user registration successfull welcome, ' + newUser);
          alert('registration successfull! welcome, ' + newUser.username);
          navigate('/login');
        }
      }catch (error) {
       console.error('Network error during regitration:', error);
       alert('Could not connect to the server. Please try again later.');
    }
  }
  
  return (
     <div className="register-bg-wrapper">
    <div className="register-container">
      <h1>Register here!</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            autoComplete="current-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
    </div>
  );
};

export default SimpleRegistrationPage

