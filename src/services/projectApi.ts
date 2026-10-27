import type { ProjectData } from '../domain/models';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const PROJECTS_URL = `${BASE_URL}/projects`;

// A API REST é simulada com JSON Server, mas a comunicação usa HTTP real.
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na API (HTTP ${response.status}). Verifique o servidor.`);
    }
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Não foi possível contactar a API. Execute "npm run api".');
    }
    throw error;
  }
}

export const projectApi = {
  getAll(): Promise<ProjectData[]> {
    return request<ProjectData[]>(PROJECTS_URL);
  },

  create(project: ProjectData): Promise<ProjectData> {
    return request<ProjectData>(PROJECTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
  },

  update(project: ProjectData): Promise<ProjectData> {
    return request<ProjectData>(`${PROJECTS_URL}/${encodeURIComponent(project.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
  },

  remove(id: string): Promise<void> {
    return request<void>(`${PROJECTS_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
};
