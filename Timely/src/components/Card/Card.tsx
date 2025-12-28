import type { ReactNode } from 'react';

type ProjectCardProps = {
    icon : ReactNode;
    title : string;
    description : string;
};

export default function ProjectCard({ icon, title, description }: ProjectCardProps) {
    return (
    <div className="project-card">
      <div className="project-card__header">
        {icon}
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__description">{description}</p>
      </div>
    </div>
    );
}