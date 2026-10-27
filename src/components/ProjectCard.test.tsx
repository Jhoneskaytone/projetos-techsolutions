import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Project } from '../domain/models';
import { ProjectCard } from './ProjectCard';

describe('Cartão do projeto', () => {
  it('mostra o nome e o progresso e permite selecionar o projeto', () => {
    const project = new Project({
      id: '1', name: 'Aplicação de exemplo', description: 'Gestão de projetos',
      createdAt: '2026-10-01T10:00:00.000Z',
      tasks: [{ id: 't1', title: 'Tarefa completa', description: 'Descrição válida', dueDate: '2026-11-01', status: 'concluida', createdAt: '2026-10-01T10:00:00.000Z' }]
    });
    const select = vi.fn();
    render(<ProjectCard project={project} selected={false} onSelect={select} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Aplicação de exemplo')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    fireEvent.click(screen.getByRole('button', { name: /Aplicação de exemplo/ }));
    expect(select).toHaveBeenCalledOnce();
  });
});
