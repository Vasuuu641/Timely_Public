import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Navbar/Sidebar";
import {
  getTodaySummary,
  getTodayReview,
  createReview,
  updateReview,
  type TodaySummary,
  type DailyReview,
} from "../../api/review";
import { fetchTodos } from "../../api/todo";
import "./Review.css";

const Review = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;
  const navigate = useNavigate();

  const [summary, setSummary] = useState<TodaySummary | null>(null);
  const [review, setReview] = useState<DailyReview | null>(null);
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState<"great" | "okay" | "challenging" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);

  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryData, reviewData, todosData] = await Promise.all([
          getTodaySummary(),
          getTodayReview().catch(() => null),
          fetchTodos(),
        ]);

        setSummary(summaryData);

        // Filter completed and pending tasks for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayTodos = todosData.filter((todo) => {
          const todoDate = new Date(todo.updatedAt);
          return (
            todoDate >= today &&
            todoDate < tomorrow
          );
        });

        setCompletedTasks(todayTodos.filter((t) => t.isCompleted));
        setPendingTasks(todayTodos.filter((t) => !t.isCompleted));

        if (reviewData && reviewData.id) {
          setReview(reviewData);
          setReflection(reviewData.reflection || "");
          // Convert rating to mood (you might need to adjust based on your rating system)
          if (reviewData.rating === 3) setMood("great");
          else if (reviewData.rating === 2) setMood("okay");
          else if (reviewData.rating === 1) setMood("challenging");
        }
      } catch (err: any) {
        console.error("Error loading review data:", err);
        setError(err.message || "Failed to load review data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveReview = async () => {
    if (!reflection.trim()) {
      setError("Please write a reflection before saving");
      return;
    }

    try {
      setSaving(true);
      const moodToRating = {
        great: 3,
        okay: 2,
        challenging: 1,
      };

      const reviewData = {
        reflection,
        rating: mood ? moodToRating[mood] : undefined,
      };

      if (review && review.id) {
        // Update existing review
        const updated = await updateReview(review.id, reviewData);
        setReview(updated);
      } else {
        // Create new review
        const created = await createReview(reviewData);
        setReview(created);
      }

      setError(null);
      // Show success message (could use toast)
      setTimeout(() => {
        alert("Review saved successfully!");
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const today = new Date();

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar userEmail={email} />
        <main style={{ flex: 1, padding: "2rem", background: "#E0FBE2" }}>
          <p>Loading review data...</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar userEmail={email} />

      <main className="review-container">
        <header className="review-header">
          <div>
            <h1>Daily Review</h1>
            <p>Reflect on your accomplishments and progress</p>
            <p className="review-date">📅 {formatDate(today)}</p>
          </div>
          <button 
            className="history-btn" 
            onClick={() => navigate("/review/history")}
          >
            📚 View History
          </button>
        </header>

        <div className="review-content">
          {/* Today's Summary Section */}
          <section className="summary-section card">
            <h2>📊 Today's Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon">✓</div>
                <div className="summary-value">{summary?.tasksDone || 0}</div>
                <div className="summary-label">Tasks Done</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">⚡</div>
                <div className="summary-value">{summary?.focusSessions || 0}</div>
                <div className="summary-label">Focus Sessions</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">⭐</div>
                <div className="summary-value">{summary?.studyTime.toFixed(1) || "0h"}</div>
                <div className="summary-label">Study Time</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📈</div>
                <div className="summary-value">{summary?.completionPercentage || 0}%</div>
                <div className="summary-label">Completion</div>
              </div>
            </div>
          </section>

          <div className="review-grid">
            {/* Mood Section */}
            <section className="mood-section card">
              <h2>How do you feel about today?</h2>
              <div className="mood-buttons">
                <button
                  className={`mood-btn ${mood === "great" ? "active" : ""}`}
                  onClick={() => setMood("great")}
                >
                  😊 Great
                </button>
                <button
                  className={`mood-btn ${mood === "okay" ? "active" : ""}`}
                  onClick={() => setMood("okay")}
                >
                  😐 Okay
                </button>
                <button
                  className={`mood-btn ${mood === "challenging" ? "active" : ""}`}
                  onClick={() => setMood("challenging")}
                >
                  😟 Challenging
                </button>
              </div>
            </section>

            {/* Daily Reflection Section */}
            <section className="reflection-section card">
              <h2>Daily Reflection</h2>
              <p className="reflection-subtitle">What did you learn? What can you improve?</p>
              <textarea
                className="reflection-textarea"
                placeholder="Write your thoughts about today..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={6}
              />
              <button
                className="save-review-btn"
                onClick={handleSaveReview}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Daily Review"}
              </button>
              {error && <p className="error-message">{error}</p>}
            </section>
          </div>

          {/* Goal Achievement Section */}
          {summary && summary.studyGoals.length > 0 && (
            <section className="goals-section card">
              <h2>📍 Goal Achievement</h2>
              <p className="goals-subtitle">Your progress towards today's goals</p>
              <div className="goals-list">
                {summary.studyGoals.map((goal) => (
                  <div key={goal.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-label">{goal.notes || goal.type}</span>
                      <span className="goal-target">{goal.target} {goal.type}</span>
                    </div>
                    <div className="goal-progress-bar">
                      <div
                        className="goal-progress-fill"
                        style={{ width: `${Math.min(100, (0 / goal.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Tasks Section */}
          <section className="tasks-section card">
            <h2>✅ Completed Tasks</h2>
            {completedTasks.length > 0 ? (
              <div className="tasks-list">
                {completedTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      {task.dueDate && (
                        <div className="task-time">
                          Completed at{" "}
                          {new Date(task.updatedAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                    <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="placeholder-text">No tasks completed yet</p>
            )}
          </section>

          {/* Pending Tasks Section */}
          <section className="pending-section card">
            <h2>⏳ Pending Tasks</h2>
            {pendingTasks.length > 0 ? (
              <div className="tasks-list">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      {task.dueDate && (
                        <div className="task-time">
                          Due:{" "}
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                    <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="placeholder-text">No pending tasks for today</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Review;