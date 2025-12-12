
import CardComponent from '../components/card';
import './Cards.css';
import { useTheme } from '../../../context/ThemeContext';

const cardData = [
    { title: "Schedule your day", text: "Organize task by day, topic, or hourly slots.", color: "green1" },
    { title: "Manage To-Do Lists", text: "Prioritize and track your tasks effortlessly.", color: "green2" },
    { title: "Create Custom Quizes", text: "Test your knowledge and learn effectively.", color: "green3" },
    { title: "Note With Code Support", text: "Capture ideas and code snippets in one place.", color: "green4" },
    { title: "Pomodoro Focus", text: "Boost concentration with timed work sessions.", color: "green5" },
    { title: "Daily Planning & Review", text: "Plan ahead and review your progress.", color: "green6" },
];



function Cards() {
    const { isDarkMode } = useTheme();

    return (
        <>
               <div className={`cards-container ${isDarkMode ? 'dark' : ''}`}>
                
                {cardData.map((cardItem, index) => (
                    <a 
                        key={index}
                        href={`/${cardItem.title.split(' ')[0].toUpperCase()}`}
                        style={{textDecoration: 'none'}}>
                        <CardComponent _card={cardItem} color={cardItem.color}/>
                    </a>
                ))}
                
            </div>

        </>
    );
}

export default Cards;