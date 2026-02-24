import "./Todo.css";
import Sidebar from "../../components/Navbar/Sidebar";
import { useEffect, useState } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo, type Todo as TodoType, type CreateTodoDto, type TodoPriority } from "../../api/todo";
import { Plus, X, Trash2 } from "lucide-react";

type FilterType = 'all' | 'active' | 'completed';

const Todo = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateTodoDto>({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = localStorage.getItem("userEmail") ?? undefined;

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateTodoDto = {
        title: formData.title,
        ...(formData.description?.trim() ? { description: formData.description } : {}),
        ...(formData.dueDate ? { dueDate: formData.dueDate } : {}),
        priority: formData.priority,
      };

      await createTodo(payload);
      await loadTodos();
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
      });
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert(`Failed to create todo. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (todo: TodoType) => {
    try {
      await updateTodo(todo.id, { isCompleted: !todo.isCompleted });
      await loadTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
      alert('Failed to delete task');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true;
  });

  const totalCount = todos.length;
  const activeCount = todos.filter(t => !t.isCompleted).length;
  const completedCount = todos.filter(t => t.isCompleted).length;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `Due: ${date.toISOString().split('T')[0]}`;
  };

  return (
    <div className="todo-layout">
      <Sidebar userEmail={email} />
      
      <div className="todo-content">
        <div className="todo-page">
          <div className="todo-header">
            <div className="todo-header-text">
              <h1 className="todo-title">Todo List</h1>
              <p className="todo-subtitle">
                Manage your tasks and stay organized
              </p>
            </div>
            <button className="new-task-btn" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              New Task
            </button>
          </div>

          <div className="todo-stats">
            <div className="stat-card">
              <div className="stat-number">{totalCount}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{activeCount}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{completedCount}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="todo-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {loading ? (
            <div className="todo-loading">Loading tasks...</div>
          ) : filteredTodos.length === 0 ? (
            <div className="todo-empty">
              {filter === 'all' 
                ? "No tasks yet. Create your first task!" 
                : `No ${filter} tasks`}
            </div>
          ) : (
            <div className="todo-list">
              {filteredTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}
                >
                  <div 
                    className={`todo-checkbox ${todo.isCompleted ? 'checked' : ''}`}
                    onClick={() => handleToggleComplete(todo)}
                  />
                  
                  <div className="todo-content-wrapper">
                    <div className="todo-item-title">{todo.title}</div>
                    <div className="todo-meta">
                      <span className={`priority-badge ${todo.priority.toLowerCase()}`}>
                        {todo.priority.toLowerCase()}
                      </span>
                      {todo.dueDate && (
                        <span className="due-date">{formatDate(todo.dueDate)}</span>
                      )}
                    </div>
                  </div>

                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Todo Modal */}
      {showModal && (
        <div className="todo-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="todo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="todo-modal-header">
              <h2 className="todo-modal-title">Create New Task</h2>
              <button className="todo-modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="todo-modal-body">
              <form className="todo-form" onSubmit={handleCreateTodo}>
                <div className="todo-form-group">
                  <label className="todo-form-label">Title *</label>
                  <input
                    type="text"
                    className="todo-form-input"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="todo-form-group">
                  <label className="todo-form-label">Description (Optional)</label>
                  <textarea
                    className="todo-form-textarea"
                    placeholder="Add task description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="todo-form-group">
                  <label className="todo-form-label">Priority</label>
                  <select
                    className="todo-form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TodoPriority })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="todo-form-group">
                  <label className="todo-form-label">Due Date (Optional)</label>
                  <input
                    type="date"
                    className="todo-form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="todo-form-actions">
                  <button
                    type="button"
                    className="todo-form-btn todo-form-btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="todo-form-btn todo-form-btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Task"}
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


export default Todo;