import "./Goal.css";
import Sidebar from "../../components/Navbar/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { fetchDashboardData, type GoalProgress } from "../../api/dashboard";
import {
  createStudyGoal,
  updateStudyGoal,
  deleteStudyGoal,
  type CreateGoalDto,
  type GoalType,
} from "../../api/goal";
import { Plus, X, Trash2, Pencil } from "lucide-react";

type FilterType = "all" | "active" | "completed";

const DEFAULT_FORM: CreateGoalDto = {
  type: "TASK",
  target: 1,
  notes: "",
  startDate: "",
  endDate: "",
};

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  TASK: "Tasks",
  NOTE: "Notes",
  POMODORO: "Pomodoro",
  STUDY_HOURS: "Study Hours",
};

const GOAL_UNIT_LABELS: Record<GoalType, string> = {
  TASK: "tasks",
  NOTE: "notes",
  POMODORO: "sessions",
  STUDY_HOURS: "hours",
};

const Goal = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalProgress | null>(null);
  const [formData, setFormData] = useState<CreateGoalDto>(DEFAULT_FORM);

  useEffect(() => {
    loadGoals();

    const handleRefresh = () => loadGoals();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadGoals();
    };

    window.addEventListener("goals:refresh", handleRefresh);
    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("goals:refresh", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setGoals(data.goals);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalCount = goals.length;
  const completedCount = goals.filter(g => g.progressPercent >= 100).length;
  const activeCount = totalCount - completedCount;

  const filteredGoals = useMemo(() => {
    if (filter === "completed") return goals.filter(g => g.progressPercent >= 100);
    if (filter === "active") return goals.filter(g => g.progressPercent < 100);
    return goals;
  }, [goals, filter]);

  const formatDateInput = (value: Date) => {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateRange = (start: Date, end: Date) => {
    const toLabel = (d: Date) => d.toISOString().split("T")[0];
    return `${toLabel(start)} - ${toLabel(end)}`;
  };

  const getGoalStatus = (goal: GoalProgress) => {
    if (goal.progressPercent >= 100) return "completed";
    const end = new Date(goal.endDate).getTime();
    if (end < Date.now()) return "ended";
    return "active";
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData(DEFAULT_FORM);
    setShowModal(true);
  };

  const openEditModal = (goal: GoalProgress) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type as GoalType,
      target: goal.target,
      notes: goal.notes ?? "",
      startDate: formatDateInput(new Date(goal.startDate)),
      endDate: formatDateInput(new Date(goal.endDate)),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.notes.trim()) {
      alert("Please add a goal description");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Please select a valid date range");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("End date must be after start date");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingGoal) {
        await updateStudyGoal(editingGoal.id, formData);
      } else {
        await createStudyGoal(formData);
      }
      await loadGoals();
      setShowModal(false);
      setEditingGoal(null);
      setFormData(DEFAULT_FORM);
    } catch (error) {
      console.error("Failed to save goal:", error);
      alert(`Failed to save goal. ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteStudyGoal(goalId);
      await loadGoals();
    } catch (error) {
      console.error("Failed to delete goal:", error);
      alert("Failed to delete goal");
    }
  };

  return (
    <div className="goal-layout">
      <Sidebar userEmail={email} />

      <div className="goal-content">
        <div className="goal-page">
          <div className="goal-header">
            <div className="goal-header-text">
              <h1 className="goal-title">Study Goals</h1>
              <p className="goal-subtitle">Set targets and track your progress</p>
            </div>
            <button className="goal-new-btn" onClick={openCreateModal}>
              <Plus size={20} />
              New Goal
            </button>
          </div>

          <div className="goal-stats">
            <div className="goal-stat-card">
              <div className="goal-stat-number">{totalCount}</div>
              <div className="goal-stat-label">Total Goals</div>
            </div>
            <div className="goal-stat-card">
              <div className="goal-stat-number">{activeCount}</div>
              <div className="goal-stat-label">Active</div>
            </div>
            <div className="goal-stat-card">
              <div className="goal-stat-number">{completedCount}</div>
              <div className="goal-stat-label">Completed</div>
            </div>
          </div>

          <div className="goal-filters">
            <button
              className={`goal-filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Goals
            </button>
            <button
              className={`goal-filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`goal-filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          {loading ? (
            <div className="goal-loading">Loading goals...</div>
          ) : filteredGoals.length === 0 ? (
            <div className="goal-empty">
              {filter === "all" ? "No goals yet. Create your first goal!" : `No ${filter} goals`}
            </div>
          ) : (
            <div className="goal-grid">
              {filteredGoals.map(goal => {
                const status = getGoalStatus(goal);
                const unit = GOAL_UNIT_LABELS[goal.type as GoalType] ?? "items";
                const title = `${GOAL_TYPE_LABELS[goal.type as GoalType]} Goal`;

                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-card-header">
                      <div className="goal-card-title">
                        {title}
                      </div>
                      <span className={`goal-status ${status}`}>
                        {status === "completed" ? "Completed" : status === "ended" ? "Ended" : "Active"}
                      </span>
                    </div>

                    <div className="goal-progress-label">Progress</div>
                    <div className="goal-progress-row">
                      <div className="goal-progress-bar">
                        <div
                          className="goal-progress-fill"
                          style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
                        />
                      </div>
                      <div className="goal-progress-count">
                        {goal.current} / {goal.target} {unit}
                      </div>
                    </div>

                    <p className="goal-notes">{goal.notes}</p>

                    <div className="goal-date-row">
                      {formatDateRange(new Date(goal.startDate), new Date(goal.endDate))}
                    </div>

                    <div className="goal-card-actions">
                      <button className="goal-action-btn" onClick={() => openEditModal(goal)}>
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button className="goal-delete-btn" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="goal-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="goal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="goal-modal-header">
              <h2 className="goal-modal-title">
                {editingGoal ? "Edit Goal" : "Create New Goal"}
              </h2>
              <button className="goal-modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="goal-modal-body">
              <form className="goal-form" onSubmit={handleSubmit}>
                <div className="goal-form-group">
                  <label className="goal-form-label">Goal Type</label>
                  <select
                    className="goal-form-select"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as GoalType })
                    }
                  >
                    <option value="TASK">Tasks</option>
                    <option value="STUDY_HOURS">Study Hours</option>
                    <option value="POMODORO">Pomodoro Sessions</option>
                    <option value="NOTE">Notes</option>
                  </select>
                </div>

                <div className="goal-form-group">
                  <label className="goal-form-label">Target</label>
                  <input
                    type="number"
                    min={1}
                    className="goal-form-input"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData({ ...formData, target: Number(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="goal-form-group">
                  <label className="goal-form-label">Description</label>
                  <textarea
                    className="goal-form-textarea"
                    placeholder="Describe your goal"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    required
                  />
                </div>

                <div className="goal-form-row">
                  <div className="goal-form-group">
                    <label className="goal-form-label">Start Date</label>
                    <input
                      type="date"
                      className="goal-form-input"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="goal-form-group">
                    <label className="goal-form-label">End Date</label>
                    <input
                      type="date"
                      className="goal-form-input"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="goal-form-actions">
                  <button
                    type="button"
                    className="goal-form-btn goal-form-btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="goal-form-btn goal-form-btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goal;