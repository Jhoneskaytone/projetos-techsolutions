import { describe, expect, it } from 'vitest';
import { Entity, Project, Task, createProject, createTask, type ProjectData } from './models';

const example: ProjectData = {
  id: 'p-1',
  name: 'Projeto de teste',
  description: 'Descrição do projeto',
  createdAt: '2026-10-10T12:00:00.000Z',
  tasks: [
    { id: 't-1', title: 'Tarefa 1', description: 'Primeira tarefa', dueDate: '2026-11-10', status: 'concluida', createdAt: '2026-10-10T12:00:00.000Z' },
    { id: 't-2', title: 'Tarefa 2', description: 'Segunda tarefa', dueDate: '2026-11-11', status: 'pendente', createdAt: '2026-10-10T12:00:00.000Z' },
    { id: 't-3', title: 'Tarefa 3', description: 'Terceira tarefa', dueDate: '2026-11-12', status: 'concluida', createdAt: '2026-10-10T12:00:00.000Z' }
  ]
};

describe('Project e Task', () => {
  it('usa classes, herança e composição', () => {
    const project = new Project(example);
    expect(project).toBeInstanceOf(Entity);
    expect(project.tasks[0]).toBeInstanceOf(Task);
    expect(project.tasks[0]).toBeInstanceOf(Entity);
    expect(project.tasks).toHaveLength(3);
  });

  it('calcula a percentagem de tarefas concluídas', () => {
    const project = new Project(example);
    expect(project.completedTasks).toBe(2);
    expect(project.progressPercent).toBe(67);
  });

  it('mostra 0% quando um projeto não possui tarefas', () => {
    const project = new Project({ ...example, tasks: [] });
    expect(project.progressPercent).toBe(0);
  });

  it('converte as classes para dados simples que podem ser enviados para a API', () => {
    const project = new Project(example);
    expect(project.toJSON()).toEqual(example);
  });

  it('cria projetos e tarefas com identificadores diferentes', () => {
    const project1 = createProject({ name: ' Teste ', description: ' Descrição válida ' });
    const project2 = createProject({ name: 'Teste dois', description: 'Outra descrição' });
    const task = createTask({ title: ' Tarefa ', description: ' Descrição da tarefa ', dueDate: '2026-11-20', status: 'pendente' });
    expect(project1.id).not.toBe(project2.id);
    expect(project1.name).toBe('Teste');
    expect(task.title).toBe('Tarefa');
    expect(task.id).toBeTruthy();
  });
});
