import "./Schedule.css";
import Sidebar from "../../components/Navbar/Sidebar";
import { useEffect, useState } from "react";
import { 
  fetchScheduleEntries, 
  createScheduleEntry, 
  updateScheduleEntry,
  deleteScheduleEntry,
  type ScheduleEntry, 
  type CreateScheduleEntryDto 
} from "../../api/schedule";
import { Plus, X, Calendar, Clock, Edit2, Trash2 } from "lucide-react";

type ViewMode = 'week' | 'list';

const Schedule = () => {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateScheduleEntryDto>({
    title: "",
    startTime: "",
    endTime: "",
    notes: "",
    topic: "General",
    priority: "Medium",
    status: "ToDo",
    isDailyPlan: false,
    isRecurring: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = localStorage.getItem("userEmail") ?? undefined;

  useEffect(() => {
    loadSchedules();
  }, []);

  const getDefaultDateTime = () => {
    const now = new Date();
    // Format: YYYY-MM-DDTHH:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getDefaultEndDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour for end time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await fetchScheduleEntries();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that both title and startTime are filled
    if (!formData.title.trim()) {
      alert("Please enter an event title");
      return;
    }
    
    if (!formData.startTime || formData.startTime.trim() === "") {
      alert("Please enter a start date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateScheduleEntryDto = {
        title: formData.title,
        startTime: formData.startTime,
        isDailyPlan: formData.isDailyPlan,
        ...(formData.endTime ? { endTime: formData.endTime } : {}),
        ...(formData.notes?.trim() ? { notes: formData.notes } : {}),
        ...(formData.topic ? { topic: formData.topic } : {}),
        priority: formData.priority,
        status: formData.status,
        isRecurring: formData.isRecurring || false,
      };

      await createScheduleEntry(payload);
      await loadSchedules();
      setShowModal(false);
      setFormData({
        title: "",
        startTime: "",
        endTime: "",
        notes: "",
        topic: "General",
        priority: "Medium",
        status: "ToDo",
        isDailyPlan: false,
        isRecurring: false,
      });
    } catch (error) {
      console.error("Failed to create schedule:", error);
      alert(`Failed to create event. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) return;
    
    if (!formData.title.trim()) {
      alert("Please enter an event title");
      return;
    }
    
    if (!formData.startTime || formData.startTime.trim() === "") {
      alert("Please enter a start date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<CreateScheduleEntryDto> = {
        title: formData.title,
        startTime: formData.startTime,
        isDailyPlan: formData.isDailyPlan,
        ...(formData.endTime ? { endTime: formData.endTime } : {}),
        ...(formData.notes?.trim() ? { notes: formData.notes } : {}),
        ...(formData.topic ? { topic: formData.topic } : {}),
        priority: formData.priority,
        status: formData.status,
        isRecurring: formData.isRecurring || false,
      };

      await updateScheduleEntry(selectedEvent.id, payload);
      await loadSchedules();
      setShowDetailModal(false);
      setIsEditing(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to update schedule:", error);
      alert(`Failed to update event. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!selectedEvent) return;
    
    if (!confirm(`Are you sure you want to delete "${selectedEvent.title}"?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteScheduleEntry(selectedEvent.id);
      await loadSchedules();
      setShowDetailModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert(`Failed to delete event. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime || "",
        notes: selectedEvent.notes || "",
        topic: selectedEvent.topic || "General",
        priority: selectedEvent.priority || "Medium",
        status: selectedEvent.status || "ToDo",
        isDailyPlan: selectedEvent.isDailyPlan,
        isRecurring: selectedEvent.isRecurring,
      });
      setIsEditing(true);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getDuration = (start: string, end?: string) => {
    if (!end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${Math.round(diff)}h`;
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const groupByDay = () => {
    const grouped: { [key: string]: ScheduleEntry[] } = {};
    
    schedules.forEach(schedule => {
      const day = getDayOfWeek(schedule.startTime);
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(schedule);
    });

    // Sort events within each day by start time
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    return grouped;
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const groupedByDay = groupByDay();

  return (
    <div className="schedule-layout">
      <Sidebar userEmail={email} />
      
      <div className="schedule-content">
        <div className="schedule-page">
          <div className="schedule-header">
            <div className="schedule-header-text">
              <h1 className="schedule-title">Schedule</h1>
              <p className="schedule-subtitle">
                Plan and organize your time effectively
              </p>
            </div>
            <button 
              className="add-event-btn" 
              onClick={() => {
                setFormData({
                  title: "",
                  startTime: getDefaultDateTime(),
                  endTime: getDefaultEndDateTime(),
                  notes: "",
                  topic: "General",
                  priority: "Medium",
                  status: "ToDo",
                  isDailyPlan: false,
                  isRecurring: false,
                });
                setShowModal(true);
              }}
            >
              <Plus size={20} />
              Add Event
            </button>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week View
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>

          {loading ? (
            <div className="schedule-loading">Loading schedules...</div>
          ) : viewMode === 'week' ? (
            <div className="week-view">
              {daysOfWeek.map(day => (
                <div key={day} className="day-column">
                  <div className="day-header">
                    <Calendar size={18} />
                    <h3 className="day-name">{day}</h3>
                  </div>
                  <div className="events-list">
                    {groupedByDay[day] && groupedByDay[day].length > 0 ? (
                      groupedByDay[day].map(event => (
                        <div 
                          key={event.id} 
                          className="event-card"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDetailModal(true);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="event-header">
                            <Clock size={16} />
                            <div className="event-title">{event.title}</div>
                          </div>
                          <p className="event-time">
                            {formatTime(event.startTime)} • {getDuration(event.startTime, event.endTime)}
                          </p>
                          {event.topic && (
                            <span className="event-topic">{event.topic.toLowerCase()}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-events">No events scheduled</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="list-view">
              <div className="list-view-header">
                <h2 className="list-view-title">All Events</h2>
                <p className="list-view-subtitle">Chronological list of your scheduled events</p>
              </div>

              {schedules.length === 0 ? (
                <div className="schedule-empty">No events scheduled yet. Create your first event!</div>
              ) : (
                <>
                  {daysOfWeek.map(day => {
                    const dayEvents = groupedByDay[day];
                    if (!dayEvents || dayEvents.length === 0) return null;

                    return (
                      <div key={day} className="day-group">
                        <h3 className="day-group-title">{day}</h3>
                        <div className="list-events">
                          {dayEvents.map(event => (
                            <div 
                              key={event.id} 
                              className="list-event-card"
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowDetailModal(true);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="list-event-info">
                                <div className="list-event-title">{event.title}</div>
                                <div className="list-event-time">
                                  {formatTime(event.startTime)} • {getDuration(event.startTime, event.endTime)}
                                </div>
                              </div>
                              {event.topic && (
                                <span className="list-event-topic">{event.topic.toLowerCase()}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Schedule Modal */}
      {showModal && (
        <div className="schedule-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal-header">
              <h2 className="schedule-modal-title">Add New Event</h2>
              <button className="schedule-modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="schedule-modal-body">
              <form className="schedule-form" onSubmit={handleCreateSchedule}>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Event Title *</label>
                  <input
                    type="text"
                    className="schedule-form-input"
                    placeholder="e.g., Mathematics Lecture"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="schedule-form-row">
                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Start Date *</label>
                    <input
                      type="date"
                      className="schedule-form-input"
                      value={formData.startTime ? formData.startTime.split('T')[0] : ''}
                      onChange={(e) => {
                        const timePart = formData.startTime && formData.startTime.includes('T') 
                          ? formData.startTime.split('T')[1].substring(0, 5)
                          : '00:00';
                        setFormData({ ...formData, startTime: `${e.target.value}T${timePart}` });
                      }}
                      required
                    />
                  </div>

                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Start Time *</label>
                    <input
                      type="time"
                      className="schedule-form-input"
                      value={formData.startTime && formData.startTime.includes('T')
                        ? formData.startTime.split('T')[1].substring(0, 5)
                        : '00:00'}
                      onChange={(e) => {
                        const datePart = formData.startTime && formData.startTime.includes('T')
                          ? formData.startTime.split('T')[0]
                          : new Date().toISOString().split('T')[0];
                        setFormData({ ...formData, startTime: `${datePart}T${e.target.value}` });
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="schedule-form-row">
                  <div className="schedule-form-group">
                    <label className="schedule-form-label">End Date</label>
                    <input
                      type="date"
                      className="schedule-form-input"
                      value={formData.endTime && formData.endTime.includes('T') 
                        ? formData.endTime.split('T')[0] 
                        : ''}
                      onChange={(e) => {
                        const timePart = formData.endTime && formData.endTime.includes('T')
                          ? formData.endTime.split('T')[1].substring(0, 5)
                          : '00:00';
                        setFormData({ ...formData, endTime: e.target.value ? `${e.target.value}T${timePart}` : '' });
                      }}
                    />
                  </div>

                  <div className="schedule-form-group">
                    <label className="schedule-form-label">End Time</label>
                    <input
                      type="time"
                      className="schedule-form-input"
                      value={formData.endTime && formData.endTime.includes('T')
                        ? formData.endTime.split('T')[1].substring(0, 5)
                        : ''}
                      onChange={(e) => {
                        const datePart = formData.endTime && formData.endTime.includes('T')
                          ? formData.endTime.split('T')[0]
                          : formData.startTime && formData.startTime.includes('T')
                          ? formData.startTime.split('T')[0]
                          : new Date().toISOString().split('T')[0];
                        setFormData({ ...formData, endTime: e.target.value ? `${datePart}T${e.target.value}` : '' });
                      }}
                    />
                  </div>
                </div>

                <div className="schedule-form-group">
                  <label className="schedule-form-label">Topic/Category</label>
                  <input
                    type="text"
                    className="schedule-form-input"
                    placeholder="e.g., class, lab, study"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>

                <div className="schedule-form-group">
                  <label className="schedule-form-label">Notes</label>
                  <textarea
                    className="schedule-form-textarea"
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="schedule-form-row">
                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Priority</label>
                    <select
                      className="schedule-form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Status</label>
                    <select
                      className="schedule-form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ToDo">To Do</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="schedule-form-actions">
                  <button
                    type="button"
                    className="schedule-form-btn schedule-form-btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="schedule-form-btn schedule-form-btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Add Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="schedule-modal-overlay" onClick={() => {
          setShowDetailModal(false);
          setIsEditing(false);
        }}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal-header">
              <h2 className="schedule-modal-title">
                {isEditing ? 'Edit Event' : selectedEvent.title}
              </h2>
              <button className="schedule-modal-close" onClick={() => {
                setShowDetailModal(false);
                setIsEditing(false);
              }}>
                <X size={24} />
              </button>
            </div>

            <div className="schedule-modal-body">
              {isEditing ? (
                <form className="schedule-form" onSubmit={handleUpdateSchedule}>
                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Event Title *</label>
                    <input
                      type="text"
                      className="schedule-form-input"
                      placeholder="e.g., Mathematics Lecture"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="schedule-form-row">
                    <div className="schedule-form-group">
                      <label className="schedule-form-label">Start Date *</label>
                      <input
                        type="date"
                        className="schedule-form-input"
                        value={formData.startTime ? formData.startTime.split('T')[0] : ''}
                        onChange={(e) => {
                          const timePart = formData.startTime && formData.startTime.includes('T') 
                            ? formData.startTime.split('T')[1].substring(0, 5)
                            : '00:00';
                          setFormData({ ...formData, startTime: `${e.target.value}T${timePart}` });
                        }}
                        required
                      />
                    </div>

                    <div className="schedule-form-group">
                      <label className="schedule-form-label">Start Time *</label>
                      <input
                        type="time"
                        className="schedule-form-input"
                        value={formData.startTime && formData.startTime.includes('T')
                          ? formData.startTime.split('T')[1].substring(0, 5)
                          : '00:00'}
                        onChange={(e) => {
                          const datePart = formData.startTime && formData.startTime.includes('T')
                            ? formData.startTime.split('T')[0]
                            : new Date().toISOString().split('T')[0];
                          setFormData({ ...formData, startTime: `${datePart}T${e.target.value}` });
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="schedule-form-row">
                    <div className="schedule-form-group">
                      <label className="schedule-form-label">End Date</label>
                      <input
                        type="date"
                        className="schedule-form-input"
                        value={formData.endTime && formData.endTime.includes('T') 
                          ? formData.endTime.split('T')[0] 
                          : ''}
                        onChange={(e) => {
                          const timePart = formData.endTime && formData.endTime.includes('T')
                            ? formData.endTime.split('T')[1].substring(0, 5)
                            : '00:00';
                          setFormData({ ...formData, endTime: e.target.value ? `${e.target.value}T${timePart}` : '' });
                        }}
                      />
                    </div>

                    <div className="schedule-form-group">
                      <label className="schedule-form-label">End Time</label>
                      <input
                        type="time"
                        className="schedule-form-input"
                        value={formData.endTime && formData.endTime.includes('T')
                          ? formData.endTime.split('T')[1].substring(0, 5)
                          : ''}
                        onChange={(e) => {
                          const datePart = formData.endTime && formData.endTime.includes('T')
                            ? formData.endTime.split('T')[0]
                            : formData.startTime && formData.startTime.includes('T')
                            ? formData.startTime.split('T')[0]
                            : new Date().toISOString().split('T')[0];
                          setFormData({ ...formData, endTime: e.target.value ? `${datePart}T${e.target.value}` : '' });
                        }}
                      />
                    </div>
                  </div>

                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Topic/Category</label>
                    <input
                      type="text"
                      className="schedule-form-input"
                      placeholder="e.g., class, lab, study"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    />
                  </div>

                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Notes</label>
                    <textarea
                      className="schedule-form-textarea"
                      placeholder="Add any additional notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="schedule-form-row">
                    <div className="schedule-form-group">
                      <label className="schedule-form-label">Priority</label>
                      <select
                        className="schedule-form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div className="schedule-form-group">
                      <label className="schedule-form-label">Status</label>
                      <select
                        className="schedule-form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="ToDo">To Do</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>

                  <div className="schedule-form-actions">
                    <button
                      type="button"
                      className="schedule-form-btn schedule-form-btn-cancel"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="schedule-form-btn schedule-form-btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Event"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="schedule-detail-group">
                    <label className="schedule-detail-label">Date & Time</label>
                    <p className="schedule-detail-text">
                      {new Date(selectedEvent.startTime).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="schedule-detail-text">
                      {formatTime(selectedEvent.startTime)}
                      {selectedEvent.endTime && ` - ${formatTime(selectedEvent.endTime)}`}
                      {selectedEvent.endTime && ` (${getDuration(selectedEvent.startTime, selectedEvent.endTime)})`}
                    </p>
                  </div>

                  {selectedEvent.topic && (
                    <div className="schedule-detail-group">
                      <label className="schedule-detail-label">Topic/Category</label>
                      <p className="schedule-detail-text">{selectedEvent.topic}</p>
                    </div>
                  )}

                  {selectedEvent.notes && (
                    <div className="schedule-detail-group">
                      <label className="schedule-detail-label">Notes</label>
                      <p className="schedule-detail-text">{selectedEvent.notes}</p>
                    </div>
                  )}

                  <div className="schedule-detail-row">
                    <div className="schedule-detail-group">
                      <label className="schedule-detail-label">Priority</label>
                      <span className={`schedule-priority-badge priority-${selectedEvent.priority?.toLowerCase()}`}>
                        {selectedEvent.priority || 'Medium'}
                      </span>
                    </div>

                    <div className="schedule-detail-group">
                      <label className="schedule-detail-label">Status</label>
                      <span className={`schedule-status-badge status-${selectedEvent.status?.toLowerCase()}`}>
                        {selectedEvent.status || 'ToDo'}
                      </span>
                    </div>
                  </div>

                  <div className="schedule-detail-actions">
                    <button
                      className="schedule-form-btn schedule-form-btn-delete"
                      onClick={handleDeleteSchedule}
                      disabled={isSubmitting}
                    >
                      <Trash2 size={16} />
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button
                      className="schedule-form-btn schedule-form-btn-edit"
                      onClick={handleEditClick}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      className="schedule-form-btn schedule-form-btn-cancel"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Schedule;