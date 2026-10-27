import { useState, type FormEvent } from 'react';
import { type Project, type ProjectInput } from '../domain/models';
import { validateProject, type ValidationErrors } from '../domain/validation';
import { Modal } from './Modal';

interface ProjectFormProps {
  project?: Project;
  onSave: (input: ProjectInput) => Promise<void>;
  onClose: () => void;
}

export function ProjectForm({ project, onSave, onClose }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const input = { name, description };
    const foundErrors = validateProject(input);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave(input);
      onClose();
    } catch {
      // O Provider já apresenta os erros de rede no topo da página.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={project ? 'Editar projeto' : 'Criar novo projeto'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="form-field">
          <label htmlFor="project-name">Nome do projeto *</label>
          <input id="project-name" autoFocus value={name} maxLength={81}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'project-name-error' : undefined}
            placeholder="Ex.: Atualizar o website" />
          {errors.name && <small className="field-error" id="project-name-error">{errors.name}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="project-description">Descrição *</label>
          <textarea id="project-description" rows={4} maxLength={501} value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'project-desc-error' : undefined}
            placeholder="Escreva o objetivo do projeto..." />
          {errors.description && <small className="field-error" id="project-desc-error">{errors.description}</small>}
        </div>
        <div className="modal-actions">
          <button className="button button-ghost" type="button" onClick={onClose}>Cancelar</button>
          <button className="button button-primary" disabled={saving} type="submit">
            {saving ? 'A guardar...' : 'Guardar projeto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
