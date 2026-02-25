export type Quiz = {
  id: string;
  title: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateQuizDto = {
  title: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type UpdateQuizDto = Partial<CreateQuizDto>;

const API_URL = 'http://localhost:3000';

export const fetchAllQuizzes = async (): Promise<Quiz[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/quiz`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch quizzes failed:', res.status, errorText);
    throw new Error(`Failed to fetch quizzes: ${res.status}`);
  }
  return res.json();
};

export const fetchQuiz = async (id: string): Promise<Quiz> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/quiz/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch quiz failed:', res.status, errorText);
    throw new Error(`Failed to fetch quiz: ${res.status}`);
  }
  return res.json();
};

export const createQuiz = async (data: CreateQuizDto): Promise<Quiz> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create quiz failed:', res.status, errorText);
    throw new Error(`Failed to create quiz: ${res.status}`);
  }
  return res.json();
};

export const updateQuiz = async (id: string, data: UpdateQuizDto): Promise<Quiz> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/quiz/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update quiz failed:', res.status, errorText);
    throw new Error(`Failed to update quiz: ${res.status}`);
  }
  return res.json();
};

export const deleteQuiz = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/quiz/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Delete quiz failed:', res.status, errorText);
    throw new Error(`Failed to delete quiz: ${res.status}`);
  }
};
