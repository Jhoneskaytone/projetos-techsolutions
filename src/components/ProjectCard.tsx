import type { Project } from '../domain/models';

interface ProjectCardProps {
  project: Project;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, selected, onSelect, onEdit, onDelete }: ProjectCardProps) {
  return (
    <article className={`project-card ${selected ? 'project-card-selected' : ''}`}>
      <button type="button" className="project-card-main" onClick={onSelect} aria-pressed={selected}>
        <div className="project-card-top">
          <span className="project-symbol" aria-hidden="true">{project.name.charAt(0).toUpperCase()}</span>
          <span className="project-card-arrow" aria-hidden="true">↗</span>
        </div>
        <strong className="project-title">{project.name}</strong>
        <span className="project-description">{project.description}</span>
        <span className="progress-caption">
          <span>Progresso</span><b>{project.progressPercent}%</b>
        </span>
        <span className="progress-track" role="progressbar" aria-label={`Progresso de ${project.name}`}
          aria-valuenow={project.progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <span className="progress-fill" style={{ width: `${project.progressPercent}%` }} />
        </span>
        <span className="task-count">{project.completedTasks} de {project.tasks.length} tarefas concluídas</span>
      </button>
      <div className="project-card-actions">
        <button type="button" className="text-button" onClick={onEdit}>Editar</button>
        <button type="button" className="text-button text-danger" onClick={onDelete}>Eliminar</button>
      </div>
    </article>
  );
}
