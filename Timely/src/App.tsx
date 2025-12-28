import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import Login from './pages/login/Loginn';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Todo from './pages/todo/Todo';
import Pomodoro from './pages/pomodoro/Pomodoro';
import Review from './pages/review/Review';
import Schedule from './pages/schedule/Schedule';
import Quiz from './pages/quiz/Quiz';
import Note from './pages/note/Note';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/pomodoro" element={<Pomodoro />} />
      <Route path="/review" element={<Review />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/note" element={<Note />} />
    </Routes>
  );
}

export default App;
