export type Note = {
  id: string;
  title: string;
  content: string;
  category: {
    id: string;
    name: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteDto = {
  title: string;
  content: string;
  category: string; // category ID
  tags?: string[]; // array of tag names
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchNotes = async (): Promise<Note[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/note`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json() as Promise<Note[]>;
};

export const createNote = async (data: CreateNoteDto): Promise<Note> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  // Remove tags if empty to avoid validation issues
  const payload = {
    title: data.title,
    content: data.content,
    category: data.category,
    ...(data.tags && data.tags.length > 0 ? { tags: data.tags } : {})
  };

  console.log('Creating note with payload:', payload);

  const res = await fetch(`${API_URL}/note`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create note failed:', res.status, errorText);
    throw new Error(`Failed to create note: ${res.status} - ${errorText}`);
  }
  return res.json() as Promise<Note>;
};

export const updateNote = async (id: string, data: Partial<CreateNoteDto>): Promise<Note> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  // Remove tags if empty to avoid validation issues
  const payload: any = {
    ...(data.title ? { title: data.title } : {}),
    ...(data.content ? { content: data.content } : {}),
    ...(data.category ? { category: data.category } : {}),
    ...(data.tags && data.tags.length > 0 ? { tags: data.tags } : {})
  };

  console.log('Updating note with payload:', payload);

  const res = await fetch(`${API_URL}/note/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update note failed:', res.status, errorText);
    throw new Error(`Failed to update note: ${res.status} - ${errorText}`);
  }
  return res.json() as Promise<Note>;
};

export const deleteNote = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/note/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete note");
};

export const fetchCategories = async (): Promise<Array<{ id: string; name: string }>> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/category`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json() as Promise<Array<{ id: string; name: string }>>;
};

export const createCategory = async (name: string): Promise<{ id: string; name: string }> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create category failed:', res.status, errorText);
    throw new Error(`Failed to create category: ${res.status}`);
  }
  return res.json() as Promise<{ id: string; name: string }>;
};
