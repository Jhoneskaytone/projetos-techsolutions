import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Project, createProject, createTask,
  type ProjectData, type ProjectInput, type TaskInput, type TaskStatus
} from '../domain/models';
import { projectApi } from '../services/projectApi';

export interface ProjectsContextValue {
  projects: Project[];
  loading: boolean;
  error: string | null;
  clearError: () => void;
  reload: () => Promise<void>;
  addProject: (input: ProjectInput) => Promise<Project>;
  editProject: (id: string, input: ProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (projectId: string, input: TaskInput) => Promise<void>;
  editTask: (projectId: string, taskId: string, input: TaskInput) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  changeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>;
}

export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectApi.getAll();
      setProjects(data.map((project) => new Project(project)));
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Todas as operações passam por aqui para apresentar erros num único local.
  async function withErrorHandling<T>(work: () => Promise<T>): Promise<T> {
    setError(null);
    try {
      return await work();
    } catch (cause) {
      setError(errorMessage(cause));
      throw cause;
    }
  }

  function findProject(id: string): Project {
    const project = projects.find((item) => item.id === id);
    if (!project) throw new Error('Não foi possível encontrar o projeto.');
    return project;
  }

  async function persist(project: ProjectData): Promise<void> {
    const saved = await projectApi.update(project);
    setProjects((old) => old.map((item) => item.id === saved.id ? new Project(saved) : item));
  }

  const addProject = (input: ProjectInput) => withErrorHandling(async () => {
    const saved = await projectApi.create(createProject(input));
    const project = new Project(saved);
    setProjects((old) => [...old, project]);
    return project;
  });

  const editProject = (id: string, input: ProjectInput) => withErrorHandling(async () => {
    const existing = findProject(id).toJSON();
    await persist({ ...existing, name: input.name.trim(), description: input.description.trim() });
  });

  const deleteProject = (id: string) => withErrorHandling(async () => {
    await projectApi.remove(id);
    setProjects((old) => old.filter((project) => project.id !== id));
  });

  const addTask = (projectId: string, input: TaskInput) => withErrorHandling(async () => {
    const project = findProject(projectId).toJSON();
    project.tasks.push(createTask(input));
    await persist(project);
  });

  const editTask = (projectId: string, taskId: string, input: TaskInput) => withErrorHandling(async () => {
    const project = findProject(projectId).toJSON();
    const task = project.tasks.find((item) => item.id === taskId);
    if (!task) throw new Error('Não foi possível encontrar a tarefa.');
    project.tasks = project.tasks.map((item) => item.id === taskId
      ? { ...item, ...input, title: input.title.trim(), description: input.description.trim() }
      : item);
    await persist(project);
  });

  const deleteTask = (projectId: string, taskId: string) => withErrorHandling(async () => {
    const project = findProject(projectId).toJSON();
    project.tasks = project.tasks.filter((item) => item.id !== taskId);
    await persist(project);
  });

  const changeTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => withErrorHandling(async () => {
    const project = findProject(projectId).toJSON();
    project.tasks = project.tasks.map((item) => item.id === taskId ? { ...item, status } : item);
    await persist(project);
  });

  return (
    <ProjectsContext.Provider value={{
      projects, loading, error, clearError: () => setError(null), reload,
      addProject, editProject, deleteProject, addTask, editTask, deleteTask, changeTaskStatus
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}
