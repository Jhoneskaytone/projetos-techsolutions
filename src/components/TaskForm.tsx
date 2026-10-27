import { useState, type FormEvent } from 'react';
import { TASK_STATUS_LABELS, type Task, type TaskInput, type TaskStatus } from '../domain/models';
import { validateTask, type ValidationErrors } from '../domain/validation';
import { Modal } from './Modal';

interface TaskFormProps {
  task?: Task;
  onSave: (input: TaskInput) => Promise<void>;
  onClose: () => void;
}

export function TaskForm({ task, onSave, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pendente');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const input: TaskInput = { title, description, dueDate, status };
    const foundErrors = validateTask(input);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave(input);
      onClose();
    } catch {
      // Os erros da API são apresentados pelo contexto global.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={task ? 'Editar tarefa' : 'Adicionar tarefa'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="form-field">
          <label htmlFor="task-title">Título da tarefa *</label>
          <input id="task-title" autoFocus value={title} maxLength={101}
            onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(errors.title)}
            placeholder="Ex.: Criar a página inicial" />
          {errors.title && <small className="field-error">{errors.title}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="task-description">Descrição *</label>
          <textarea id="task-description" rows={3} maxLength={501} value={description}
            onChange={(event) => setDescription(event.target.value)} aria-invalid={Boolean(errors.description)}
            placeholder="O que deve ser feito?" />
          {errors.description && <small className="field-error">{errors.description}</small>}
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-date">Data prevista *</label>
            <input id="task-date" type="date" value={dueDate}
              onChange={(event) => setDueDate(event.target.value)} aria-invalid={Boolean(errors.dueDate)} />
            {errors.dueDate && <small className="field-error">{errors.dueDate}</small>}
          </div>
          <div className="form-field">
            <label htmlFor="task-status">Estado *</label>
            <select id="task-status" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) =>
                <option key={value} value={value}>{label}</option>
              )}
            </select>
            {errors.status && <small className="field-error">{errors.status}</small>}
          </div>
        </div>
        <div className="modal-actions">
          <button className="button button-ghost" type="button" onClick={onClose}>Cancelar</button>
          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar tarefa'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
