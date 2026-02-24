export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export const TodoPriorityValues = {
  LOW: 'LOW' as const,
  MEDIUM: 'MEDIUM' as const,
  HIGH: 'HIGH' as const,
};

export type Todo = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TodoPriority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoDto = {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TodoPriority;
};

const API_URL = 'http://localhost:3000';

export const fetchTodos = async (): Promise<Todo[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/todo`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch todos failed:', res.status, errorText);
    throw new Error(`Failed to fetch todos: ${res.status}`);
  }
  return res.json();
};

export const createTodo = async (data: CreateTodoDto): Promise<Todo> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  console.log('Creating todo with payload:', data);

  const res = await fetch(`${API_URL}/todo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create todo failed:', res.status, errorText);
    throw new Error(`Failed to create todo: ${res.status} - ${errorText}`);
  }
  return res.json();
};

export const updateTodo = async (id: number, data: Partial<CreateTodoDto> & { isCompleted?: boolean }): Promise<Todo> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/todo/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update todo failed:', res.status, errorText);
    throw new Error(`Failed to update todo: ${res.status}`);
  }
  return res.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/todo/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Delete todo failed:', res.status, errorText);
    throw new Error(`Failed to delete todo: ${res.status}`);
  }
};
