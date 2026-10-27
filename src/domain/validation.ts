import type { ProjectInput, TaskInput, TaskStatus } from './models';

export type ValidationErrors = Partial<Record<keyof TaskInput | keyof ProjectInput, string>>;

export function validateProject(input: ProjectInput): ValidationErrors {
  const errors: ValidationErrors = {};
  const name = input.name.trim();
  const description = input.description.trim();

  if (name.length < 3) errors.name = 'O nome precisa de ter pelo menos 3 caracteres.';
  else if (name.length > 80) errors.name = 'O nome deve ter, no máximo, 80 caracteres.';

  if (description.length < 5) errors.description = 'A descrição precisa de ter pelo menos 5 caracteres.';
  else if (description.length > 500) errors.description = 'A descrição deve ter, no máximo, 500 caracteres.';

  return errors;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

export function validateTask(input: TaskInput): ValidationErrors {
  const errors: ValidationErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();
  const allowedStatus: TaskStatus[] = ['pendente', 'em-progresso', 'concluida'];

  if (title.length < 3) errors.title = 'O título precisa de ter pelo menos 3 caracteres.';
  else if (title.length > 100) errors.title = 'O título deve ter, no máximo, 100 caracteres.';

  if (description.length < 5) errors.description = 'A descrição precisa de ter pelo menos 5 caracteres.';
  else if (description.length > 500) errors.description = 'A descrição deve ter, no máximo, 500 caracteres.';

  if (!isValidDate(input.dueDate)) errors.dueDate = 'Indique uma data válida de conclusão.';
  if (!allowedStatus.includes(input.status)) errors.status = 'Selecione um estado válido.';

  return errors;
}
