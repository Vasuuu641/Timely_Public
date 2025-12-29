import Button from "../../components/Button/Button";
import ProjectCard from "../../components/Card/Card";
import {BookOpenText, TimerReset, TrendingUp, Lock, Timer} from "lucide-react";
import {Link} from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <section id="home">
      <div className="heading-with-icon">
        <div className="icon-box">
          <Timer size={48} />
        </div>
        Timely
      </div>

      <div className = "subheading">
      <p>Your personal system to plan, focus, and get things done.</p>
      </div>
        
        <div className = "button-container">
        <Link to= "/register">
        <Button 
        text="Get Started" 
        variant="primary" 
        />
        </Link>

        <Link to= "/login">
        <Button 
        text="I already have an account" 
        variant="outline" 
        />
        </Link>
        </div>

        <div className="cards-container">
        <ProjectCard
          icon={<BookOpenText size={32} />}
          layout= "default"
          variant="mint"
          title="Your personal study system"
          description="A flexible setup to organize tasks, schedules, and study sessions your way."
        />

        <ProjectCard
          icon={<TimerReset size = {32} />}
          layout= "default"
          variant="teal"
          title="Track what matters"
          description="Use focused, gamified timers to convert study time into real results."
        />

        <ProjectCard
          icon={<TrendingUp size={32} />}
          layout= "default"
          variant="green"
          title="Turn time into progress"
          description="See what’s done, what’s pending, and what needs attention next."
        />
        </div>

        <div className = "privacy-section-heading">
        <ProjectCard
            icon={<Lock size={40} className="privacy-icon"/>}
            layout= "privacy"
            variant=""
            title="Your Privacy Matters"
            description="Timely is a personal productivity tool. Your tasks, timers, 
            and progress are private to you and not visible to anyone else. We do not 
            enable user-to-user interaction or data sharing."
            />
        </div>
        
    </section>
  );

  
}

export default Home;

