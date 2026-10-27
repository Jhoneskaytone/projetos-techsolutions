import { useState } from 'react';
import { TASK_STATUS_LABELS, type Task, type TaskStatus } from '../domain/models';

interface TaskRowProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onChangeStatus: (status: TaskStatus) => Promise<void>;
}

function formatDate(value: string): string {
  // Meio-dia evita alterar o dia por causa dos fusos horários.
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-PT');
}

export function TaskRow({ task, onEdit, onDelete, onChangeStatus }: TaskRowProps) {
  const [updating, setUpdating] = useState(false);

  async function updateStatus(status: TaskStatus) {
    setUpdating(true);
    try {
      await onChangeStatus(status);
    } catch {
      // O estado antigo mantém-se caso a gravação na API falhe.
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article className={`task-row ${task.isCompleted ? 'task-row-completed' : ''}`}>
      <div className="task-icon" aria-hidden="true">{task.isCompleted ? '✓' : '○'}</div>
      <div className="task-body">
        <div className="task-heading">
          <h3>{task.title}</h3>
          <span className={`status-badge status-${task.status}`}>{TASK_STATUS_LABELS[task.status]}</span>
        </div>
        <p>{task.description}</p>
        <div className="task-footer">
          <span className="task-date">Data prevista: {formatDate(task.dueDate)}</span>
          <div className="task-buttons">
            <label className="sr-only" htmlFor={`status-${task.id}`}>Alterar estado de {task.title}</label>
            <select id={`status-${task.id}`} aria-label={`Alterar estado de ${task.title}`}
              value={task.status} disabled={updating}
              onChange={(event) => void updateStatus(event.target.value as TaskStatus)}>
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) =>
                <option key={value} value={value}>{label}</option>
              )}
            </select>
            <button type="button" className="text-button" onClick={onEdit}>Editar</button>
            <button type="button" className="text-button text-danger" onClick={onDelete}>Eliminar</button>
          </div>
        </div>
      </div>
    </article>
  );
}
