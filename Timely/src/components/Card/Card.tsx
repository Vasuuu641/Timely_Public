import type { ReactNode } from 'react';
import "./Card.css";

type ProjectCardProps = {
    icon : ReactNode;
    title : string;
    description : string;
    variant: "mint" | "teal" | "green" | "";
    layout: "default" | "privacy";
};

export default function ProjectCard({ icon, title, description, variant, layout }: ProjectCardProps) {
    return (
     <div className={`project-card project-card--${layout}`}>
      <div className={`project-card__icon project-card__icon--${variant}`}>
        {icon}
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__description">{description}</p>
      </div>
    </div>
    );
}