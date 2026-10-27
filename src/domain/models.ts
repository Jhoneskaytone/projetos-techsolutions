// Tipos: representam a estrutura dos dados que circulam na aplicação.
export type TaskStatus = 'pendente' | 'em-progresso' | 'concluida';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  'em-progresso': 'Em progresso',
  concluida: 'Concluída'
};

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
}

export interface ProjectInput {
  name: string;
  description: string;
}

export interface TaskData extends TaskInput {
  id: string;
  createdAt: string;
}

export interface ProjectData extends ProjectInput {
  id: string;
  createdAt: string;
  tasks: TaskData[];
}

// Herança: Project e Task partilham id e data de criação.
export abstract class Entity {
  constructor(
    public readonly id: string,
    public readonly createdAt: string
  ) {}
}

export class Task extends Entity implements TaskData {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;

  constructor(data: TaskData) {
    super(data.id, data.createdAt);
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate;
    this.status = data.status;
  }

  get isCompleted(): boolean {
    return this.status === 'concluida';
  }

  toJSON(): TaskData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      status: this.status
    };
  }
}

export class Project extends Entity implements ProjectData {
  name: string;
  description: string;
  tasks: Task[];

  constructor(data: ProjectData) {
    super(data.id, data.createdAt);
    this.name = data.name;
    this.description = data.description;
    // Composição: um projeto é constituído por várias tarefas.
    this.tasks = (data.tasks ?? []).map((task) => new Task(task));
  }

  get completedTasks(): number {
    return this.tasks.filter((task) => task.isCompleted).length;
  }

  get progressPercent(): number {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.completedTasks / this.tasks.length) * 100);
  }

  toJSON(): ProjectData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      name: this.name,
      description: this.description,
      tasks: this.tasks.map((task) => task.toJSON())
    };
  }
}

export function createProject(input: ProjectInput): ProjectData {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    description: input.description.trim(),
    tasks: []
  };
}

export function createTask(input: TaskInput): TaskData {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title: input.title.trim(),
    description: input.description.trim(),
    dueDate: input.dueDate,
    status: input.status
  };
}
