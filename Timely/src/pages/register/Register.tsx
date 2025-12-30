import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { Timer, User, Mail, Lock} from 'lucide-react';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';
import './Register.css';

interface RegisterData {
  email: string;
  username: string;
  fullname: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterData>({
    email: '',
    username: '',
    fullname: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await registerUser({
        email: form.email,
        username: form.username,
        fullname: form.fullname,
        password: form.password,
      });
      setSuccess(response.message || 'Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section id="register">
      <div className = "register-header">
        <div className = "heading-with-icon">
          <div className="icon-box">
            <Timer size={40} />
          </div>
          Timely
        </div>
      </div>

      <form className = "register-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p className = "auth-subtext">Join Timely and boost your productivity</p>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <FormInput
          label="Full Name"
          type="text"
          name="fullname"
          placeholder='e.g John Doe'
          value={form.fullname}
          onChange={handleChange}
          required
          icon={<User size={20} />}
        />
        <FormInput
          label="Username"
          type="text"
          name="username"
          placeholder='e.g StudyBuddy123'
          value={form.username}
          onChange={handleChange}
          required
          icon={<User size={20} />} 
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder='e.g john.doe@example.com'
          value={form.email}
          onChange={handleChange}
          required
          icon={<Mail size={20} />}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder='Enter your password'
          value={form.password}
          onChange={handleChange}
          required
          icon={<Lock size={20} />}
        />

        <Button text="Sign Up" variant="signin" type="submit" />

        <p className = "auth-switch">Already have an account? <a href="/login">Sign in</a></p>
      </form>
    </section>
  );
}
