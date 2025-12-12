import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import './Login.css';
import bcrypt from "bcryptjs";

export default function Login() {
  // Take in the user email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // Add error message state
  const navigate = useNavigate();

  // handleLogin function to handle the login process
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error message on new login attempt

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "GET",
        headers: {
          "content": "application/json"
        }
      });

      if(!response.ok){
        const errorData = await response.json();
        console.error("Login Failed: ", errorData);
        alert(`Login Failed: ${errorData.message || "Unknown error"}`);

        if(errorData.statusCode === 400 && errorData.message){
          if(Array.isArray(errorData.message)){
            alert('validation errors: \n' + errorData.message.join('\n'));
          }else{
            alert('validation error: ' + errorData.message);
          }
        }
      }else{
            interface User {
            email: string;
            password: string;
            fullName: string;
            [key: string]: any; // For any additional properties
            }

            const userData: User[] = await response.json();
            const currUser: User | undefined = userData.find((u: User) => u.email === email);
          if(!currUser){
            console.log(`user with email ${email} doesn't exits`);
            alert(`user with the email ${email} doen't not exist`);
          }else{
            const isMatch = await bcrypt.compare(password, currUser.password);
            if (isMatch) {
              alert(`Login successfull, ${currUser.fullName}`);
              navigate('/dashboard');
            } else {
              console.log('wrong password');
              alert("you entered wrong password.")
            }
          }
      }
    } catch (error) {
      console.error('Network error during regitration:', error);
      alert('Could not connect to the server. Please try again later.');
    }
  };

  // Login form
  return (
    <div className="login-bg-wrapper">
    <div className="login-container">
      <h1>Login to access your Timely account!</h1>
      <form onSubmit={handleLogin} className="login-form">
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
        {errorMsg && <div className="login-error">{errorMsg}</div>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
    </div>
  );
}