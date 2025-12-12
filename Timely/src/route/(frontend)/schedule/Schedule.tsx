import React, { useState } from "react";

type ScheduleItem = {
    id: number;
    title: string;
    time: string;
};

const initialSchedule: ScheduleItem[] = [
    { id: 1, title: "Morning Meeting", time: "09:00 AM" },
    { id: 2, title: "Lunch Break", time: "12:00 PM" },
    { id: 3, title: "Project Review", time: "03:00 PM" },
];

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");

    const addScheduleItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !time) return;
        setSchedule([
            ...schedule,
            { id: Date.now(), title, time },
        ]);
        setTitle("");
        setTime("");
    };

    const removeScheduleItem = (id: number) => {
        setSchedule(schedule.filter(item => item.id !== id));
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
            <h2>Schedule</h2>
            <ul>
                {schedule.map(item => (
                    <li key={item.id} style={{ marginBottom: 8 }}>
                        <strong>{item.time}</strong> - {item.title}
                        <button
                            style={{ marginLeft: 8 }}
                            onClick={() => removeScheduleItem(item.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={addScheduleItem} style={{ marginTop: 16 }}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default Schedule;