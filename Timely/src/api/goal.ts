export type GoalType = 'NOTE' | 'TASK' | 'POMODORO' | 'STUDY_HOURS';

export type StudyGoal = {
	id: string;
	type: GoalType;
	target: number;
	notes: string;
	startDate: string;
	endDate: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateGoalDto = {
	type: GoalType;
	target: number;
	notes: string;
	startDate: string;
	endDate: string;
};

export type UpdateGoalDto = Partial<CreateGoalDto>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
	const token = localStorage.getItem('token');
	if (!token) throw new Error('No auth token found!');
	return {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`,
	};
};

export const fetchStudyGoals = async (): Promise<StudyGoal[]> => {
	const res = await fetch(`${API_URL}/study-goals`, {
		headers: getAuthHeaders(),
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error('Fetch study goals failed:', res.status, errorText);
		throw new Error(`Failed to fetch goals: ${res.status}`);
	}

	return res.json();
};

export const createStudyGoal = async (data: CreateGoalDto): Promise<StudyGoal> => {
	const res = await fetch(`${API_URL}/study-goals`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error('Create study goal failed:', res.status, errorText);
		throw new Error(`Failed to create goal: ${res.status}`);
	}

	return res.json();
};

export const updateStudyGoal = async (id: string, data: UpdateGoalDto): Promise<StudyGoal> => {
	const res = await fetch(`${API_URL}/study-goals/${id}`, {
		method: 'PATCH',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error('Update study goal failed:', res.status, errorText);
		throw new Error(`Failed to update goal: ${res.status}`);
	}

	return res.json();
};

export const deleteStudyGoal = async (id: string): Promise<void> => {
	const res = await fetch(`${API_URL}/study-goals/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error('Delete study goal failed:', res.status, errorText);
		throw new Error(`Failed to delete goal: ${res.status}`);
	}
};
