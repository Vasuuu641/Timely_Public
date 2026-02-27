import { useEffect, useState } from "react";
import Sidebar from "../../components/Navbar/Sidebar";
import {
  createPomodoroSession,
  startBreak,
  endBreak,
  endPomodoroSession,
  getTodayStats,
  type PomodoroLevel,
  type PomodoroSession,
  type Break,
} from "../../api/pomodoro";
import "./Pomodoro.css";

type SessionState = PomodoroSession | null;
type BreakState = Break | null;

interface LevelConfig {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  points: number;
}

const LEVEL_CONFIGS: Record<PomodoroLevel, LevelConfig> = {
  EASY: {
    focusTime: 15,
    shortBreak: 5,
    longBreak: 15,
    points: 10,
  },
  MEDIUM: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    points: 25,
  },
  HARD: {
    focusTime: 60,
    shortBreak: 10,
    longBreak: 20,
    points: 50,
  },
};

type SessionPhase = "idle" | "focus" | "short-break" | "long-break";

const Pomodoro = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;

  // State management
  const [selectedLevel, setSelectedLevel] = useState<PomodoroLevel | null>(null);
  const [session, setSession] = useState<SessionState>(null);
  const [currentBreak, setCurrentBreak] = useState<BreakState>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Initialize with default difficulty on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch today's stats
        const todayStats = await getTodayStats();
        setCurrentStreak(todayStats.sessionsCompleted);
        setPointsEarned(todayStats.pointsToday);
        
        // Auto-start with EASY difficulty
        const newSession = await createPomodoroSession("EASY");
        setSession(newSession);
        setSelectedLevel("EASY");
        setPhase("focus");
        setTimeLeft(LEVEL_CONFIGS["EASY"].focusTime * 60);
        setCurrentBreak(null);
      } catch (err: any) {
        setError(err.message || "Failed to initialize session");
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      if (phase === "focus" && session) {
        handleFocusComplete();
      } else if (phase === "short-break" || phase === "long-break") {
        handleBreakComplete();
      }
    }
  }, [timeLeft, isRunning, phase, session]);

  const handleLevelSelect = async (level: PomodoroLevel) => {
    try {
      setLoading(true);
      setError(null);
      const newSession = await createPomodoroSession(level);
      setSession(newSession);
      setSelectedLevel(level);
      setPhase("focus");
      setTimeLeft(LEVEL_CONFIGS[level].focusTime * 60);
      setCurrentBreak(null);
      setSessionsCompleted(0);
      setPointsEarned(0);
      setSessionStarted(false);
    } catch (err: any) {
      setError(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (!session || !selectedLevel) return;
    setIsRunning(true);
    setSessionStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(
      selectedLevel ? LEVEL_CONFIGS[selectedLevel].focusTime * 60 : 0
    );
    setPhase("focus");
  };

  const handlePhaseChange = (newPhase: SessionPhase) => {
    if (isRunning) return; // Don't allow phase change while running
    setPhase(newPhase);
    setIsRunning(false);
    
    if (newPhase === "focus") {
      setTimeLeft(selectedLevel ? LEVEL_CONFIGS[selectedLevel].focusTime * 60 : 0);
    } else if (newPhase === "short-break") {
      setTimeLeft(selectedLevel ? LEVEL_CONFIGS[selectedLevel].shortBreak * 60 : 0);
    } else if (newPhase === "long-break") {
      setTimeLeft(selectedLevel ? LEVEL_CONFIGS[selectedLevel].longBreak * 60 : 0);
    }
  };

  const handleFocusComplete = async () => {
    setIsRunning(false);
    if (!session) return;

    try {
      // Start a break
      const breakResponse = await startBreak(session.id);
      setCurrentBreak(breakResponse.break);

      // Move to short break
      setPhase("short-break");
      setTimeLeft(
        selectedLevel ? LEVEL_CONFIGS[selectedLevel].shortBreak * 60 : 0
      );
      setSessionsCompleted((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Failed to start break");
    }
  };

  const handleBreakComplete = async () => {
    setIsRunning(false);
    if (!currentBreak || !session) return;

    try {
      await endBreak(currentBreak.id);
      setCurrentBreak(null);

      // Check if we should go to long break (after every 4 sessions)
      const nextSessionNumber = sessionsCompleted + 1;
      if (nextSessionNumber % 4 === 0) {
        // Go to long break
        setPhase("long-break");
        setTimeLeft(
          selectedLevel ? LEVEL_CONFIGS[selectedLevel].longBreak * 60 : 0
        );
      } else {
        // Return to focus
        setPhase("focus");
        setTimeLeft(
          selectedLevel ? LEVEL_CONFIGS[selectedLevel].focusTime * 60 : 0
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to end break");
    }
  };

  const handleEndSession = async () => {
    setIsRunning(false);
    if (!session || !selectedLevel) return;

    try {
      setLoading(true);
      // Only call endPomodoroSession if the session was actually started
      if (sessionStarted) {
        const result = await endPomodoroSession(session.id);
        setPointsEarned(result.points);
        setTotalPoints((prev) => prev + result.points);
        
        // Refresh today's stats from backend
        const todayStats = await getTodayStats();
        setSessionsCompleted(todayStats.sessionsCompleted);
        setCurrentStreak(todayStats.sessionsCompleted);
        setPointsEarned(todayStats.pointsToday);
        
        window.dispatchEvent(new Event("goals:refresh"));
      }

      // Reset for next session
      setTimeout(() => {
        setSession(null);
        setSelectedLevel(null);
        setPhase("idle");
        setTimeLeft(0);
        setCurrentBreak(null);
        setSessionsCompleted(0);
        setPointsEarned(0);
        setSessionStarted(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to end session");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentLevelConfig = () => {
    return selectedLevel ? LEVEL_CONFIGS[selectedLevel] : null;
  };

  const renderChallengeCards = () => {
    const levels: PomodoroLevel[] = ["EASY", "MEDIUM", "HARD"];
    return (
      <div className="challenge-cards">
        {levels.map((level) => (
          <div
            key={level}
            className={`challenge-card ${level.toLowerCase()} ${
              selectedLevel === level ? "selected" : ""
            }`}
            onClick={() => handleLevelSelect(level)}
          >
            <div className="card-icon">
              {level === "EASY" && "😊"}
              {level === "MEDIUM" && "⚡"}
              {level === "HARD" && "🔥"}
            </div>
            <div className="card-label">{level}</div>
            <div className="card-points">
              {LEVEL_CONFIGS[level].points} pts
            </div>
          </div>
        ))}
      </div>
    );
  };

  const levelConfig = getCurrentLevelConfig();

  // Show challenge selection if loading or error
  if (loading || error) {
    return (
      <div style={{ display: "flex", minHeight: "100vh"}}>
        <Sidebar userEmail={email} />
        <main className="pomodoro-container">
          <header className="pomodoro-header">
            <h1>Gamified Pomodoro</h1>
            <p>Level up your focus with difficulty-based challenges</p>
          </header>

          <div className="pomodoro-content" style={{ justifyItems: "center" }}>
            <section className="challenge-section" style={{ gridColumn: "1 / -1" }}>
              <h2>Choose Your Challenge</h2>
              {error && <div className="error-message">{error}</div>}
              {loading && <p style={{ color: "#999" }}>Loading...</p>}
              {!error && !loading && renderChallengeCards()}
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh"}}>
      <Sidebar userEmail={email} />

      <main className="pomodoro-container active-session">
        <header className="pomodoro-header">
          <h1>Gamified Pomodoro</h1>
          <p>Level up your focus with difficulty-based challenges</p>
          {selectedLevel && (
            <div className="difficulty-badge">
              Difficulty changed to {selectedLevel}
            </div>
          )}
        </header>

       <div className="pomodoro-content" style={{ justifyContent: "start" }}>
          <section className="timer-section">
            <div className="challenge-section">
              <h2>Choose Your Challenge</h2>
              {renderChallengeCards()}
              {selectedLevel && (
                <p className="description">
                  {selectedLevel === "EASY" && "Perfect for beginners"}
                  {selectedLevel === "MEDIUM" && "Classic Pomodoro"}
                  {selectedLevel === "HARD" && "For focused pros"}
                </p>
              )}
            </div>

            <div className="timer-controls">
              <button
                className={`phase-btn ${phase === "focus" ? "active" : ""}`}
                onClick={() => handlePhaseChange("focus")}
                disabled={isRunning}
              >
                ⏱ Focus
              </button>
              <button
                className={`phase-btn ${phase === "short-break" ? "active" : ""}`}
                onClick={() => handlePhaseChange("short-break")}
                disabled={isRunning}
              >
                🍃 Short Break
              </button>
              <button
                className={`phase-btn ${phase === "long-break" ? "active" : ""}`}
                onClick={() => handlePhaseChange("long-break")}
                disabled={isRunning}
              >
                ☀️ Long Break
              </button>
            </div>

            <div className="timer-display">
              <div className="timer-circle">
                <span className="timer-text">{formatTime(timeLeft)}</span>
                <span className="session-indicator">
                  {phase === "focus" ? `Session ${sessionsCompleted + 1}` : "Break Time"}
                </span>
              </div>
            </div>

            <div className="timer-actions">
              {!isRunning ? (
                <button
                  className="action-btn start-btn"
                  onClick={handleStart}
                  disabled={loading}
                >
                  ▶ Start
                </button>
              ) : (
                <button className="action-btn pause-btn" onClick={handlePause}>
                  ⏸ Pause
                </button>
              )}
              <button className="action-btn reset-btn" onClick={handleReset}>
                ↻
              </button>
            </div>

            <button
              className="end-session-btn"
              onClick={handleEndSession}
              disabled={loading}
            >
              End Session
            </button>
          </section>

          <aside className="stats-sidebar">
            <div className="level-badge">
              <span className="trophy">🏆</span>
              <div className="level-info">
                <p>Current Level</p>
                <h2>1</h2>
              </div>
            </div>

            <div className="total-points">
              <p>Total Points</p>
              <h3>{totalPoints}</h3>
              <p className="progress">0/100 to next level</p>
            </div>

            <div className="today-progress">
              <h3>Today's Progress</h3>
              <div className="progress-item">
                <label>Sessions</label>
                <span>{sessionsCompleted}</span>
              </div>
              <div className="progress-item">
                <label>Current Streak</label>
                <span className="streak">{currentStreak}</span>
              </div>
              <div className="progress-item">
                <label>Points Today</label>
                <span className="points">{pointsEarned}</span>
              </div>
            </div>

            <div className="mode-details">
              <h3>
                {selectedLevel === "EASY" && "Easy Mode"}
                {selectedLevel === "MEDIUM" && "Medium Mode"}
                {selectedLevel === "HARD" && "Hard Mode"}
              </h3>
              {levelConfig && (
                <>
                  <p>⏱ Focus: {levelConfig.focusTime} minutes</p>
                  <p>🍃 Short Break: {levelConfig.shortBreak} minutes</p>
                  <p>☀️ Long Break: {levelConfig.longBreak} minutes</p>
                  <p>⭐ Points per session: {levelConfig.points}</p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Pomodoro;