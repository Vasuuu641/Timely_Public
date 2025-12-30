import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { isTokenExpired } from '../../utils/jwt';
import { Mail, Timer, Lock } from 'lucide-react';
import './Login.css';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState('');

  // Redirect to dashboard if token exists and is valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      navigate('/dashboard'); // already logged in
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(form); // loginUser returns { access_token: string }
      // Store JWT token
      localStorage.setItem('token', response.access_token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section id="login">
      <div className = "login-header">
         <div className = "heading-with-icon">
        <div className="icon-box">
          <Timer size={40} />
        </div>
        Timely
      </div>
      </div>
       
      <form className = "login-form" onSubmit={handleSubmit}>
        <h2> Welcome Back </h2>
        <p className = "auth-subtext">Sign in to access your productivity dashboard</p>

        {error && <div className="login-error">{error}</div>}

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          icon={<Mail size={20} />}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          icon={<Lock size={20} />}
        />

        <Button text="Sign In" variant="signin" type="submit" />

        <p className = "auth-switch">Don't have an account? <a href="/register">Sign up</a></p>
      </form>
    </section>
  );
}
