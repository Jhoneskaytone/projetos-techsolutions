import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectForm } from './ProjectForm';

describe('Formulário de projeto', () => {
  it('mostra erros em campos inválidos e não guarda', () => {
    const save = vi.fn();
    render(<ProjectForm onSave={save} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar projeto' }));

    expect(screen.getByText('O nome precisa de ter pelo menos 3 caracteres.')).toBeInTheDocument();
    expect(screen.getByText('A descrição precisa de ter pelo menos 5 caracteres.')).toBeInTheDocument();
    expect(save).not.toHaveBeenCalled();
  });

  it('guarda dados válidos e fecha o formulário', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn();
    render(<ProjectForm onSave={save} onClose={close} />);
    fireEvent.change(screen.getByLabelText('Nome do projeto *'), { target: { value: 'Site da empresa' } });
    fireEvent.change(screen.getByLabelText('Descrição *'), { target: { value: 'Renovar o site corporativo.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar projeto' }));

    await waitFor(() => expect(save).toHaveBeenCalledWith({ name: 'Site da empresa', description: 'Renovar o site corporativo.' }));
    await waitFor(() => expect(close).toHaveBeenCalledOnce());
  });
});
