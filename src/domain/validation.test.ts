import { describe, expect, it } from 'vitest';
import { isValidDate, validateProject, validateTask } from './validation';

const validTask = {
  title: 'Criar interface',
  description: 'Desenvolver componentes',
  dueDate: '2026-11-15',
  status: 'pendente' as const
};

describe('Validação dos dados', () => {
  it('aceita um projeto com campos válidos', () => {
    expect(validateProject({ name: 'Novo projeto', description: 'Descrição suficiente' })).toEqual({});
  });

  it('rejeita um projeto com nome e descrição curtos', () => {
    const errors = validateProject({ name: 'A', description: 'Oi' });
    expect(errors.name).toBeDefined();
    expect(errors.description).toBeDefined();
  });

  it('aceita uma tarefa completa', () => {
    expect(validateTask(validTask)).toEqual({});
  });

  it('rejeita títulos vazios e data inválida', () => {
    const errors = validateTask({ ...validTask, title: '', dueDate: '2026-02-30' });
    expect(errors.title).toBeDefined();
    expect(errors.dueDate).toBeDefined();
  });

  it('valida corretamente dias e anos bissextos', () => {
    expect(isValidDate('2024-02-29')).toBe(true);
    expect(isValidDate('2025-02-29')).toBe(false);
    expect(isValidDate('2026-13-01')).toBe(false);
    expect(isValidDate('2026-12-31')).toBe(true);
  });
});
