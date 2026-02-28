export type ScheduleEntry = {
  id: string;
  title: string;
  notes?: string;
  startTime: string;
  endTime?: string;
  topic?: string;
  priority?: string;
  status?: string;
  isDailyPlan: boolean;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateScheduleEntryDto = {
  title: string;
  isDailyPlan: boolean;
  startTime: string;
  endTime?: string;
  notes?: string;
  isRecurring?: boolean;
  priority?: string;
  status?: string;
  topic?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchScheduleEntries = async (): Promise<ScheduleEntry[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/schedules`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch schedules failed:', res.status, errorText);
    throw new Error(`Failed to fetch schedules: ${res.status}`);
  }
  return res.json();
};

export const createScheduleEntry = async (data: CreateScheduleEntryDto): Promise<ScheduleEntry> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  console.log('Creating schedule with payload:', data);

  const res = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create schedule failed:', res.status, errorText);
    throw new Error(`Failed to create schedule: ${res.status} - ${errorText}`);
  }
  return res.json();
};

export const updateScheduleEntry = async (id: string, data: Partial<CreateScheduleEntryDto>): Promise<ScheduleEntry> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update schedule failed:', res.status, errorText);
    throw new Error(`Failed to update schedule: ${res.status}`);
  }
  return res.json();
};

export const deleteScheduleEntry = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found!');

  const res = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Delete schedule failed:', res.status, errorText);
    throw new Error(`Failed to delete schedule: ${res.status}`);
  }
};
