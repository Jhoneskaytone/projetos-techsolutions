import type { ProjectData } from '../domain/models';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const PROJECTS_URL = `${BASE_URL}/projects`;

// A API REST é simulada com JSON Server, mas a comunicação usa HTTP real.
async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Erro na API (HTTP ${response.status}). Confirme se o servidor está ligado.`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const projectApi = {
  async getAll(): Promise<ProjectData[]> {
    try {
      const response = await fetch(PROJECTS_URL);
      return readResponse<ProjectData[]>(response);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Não foi possível contactar a API. Execute "npm run api".');
      }
      throw error;
    }
  },

  async create(project: ProjectData): Promise<ProjectData> {
    const response = await fetch(PROJECTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return readResponse<ProjectData>(response);
  },

  async update(project: ProjectData): Promise<ProjectData> {
    const response = await fetch(`${PROJECTS_URL}/${encodeURIComponent(project.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return readResponse<ProjectData>(response);
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`${PROJECTS_URL}/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    await readResponse<void>(response);
  }
};
