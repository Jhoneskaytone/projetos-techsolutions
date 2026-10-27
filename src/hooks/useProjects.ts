import { useContext } from 'react';
import { ProjectsContext } from '../context/ProjectContext';

// Custom Hook: disponibiliza as operações sem repetir useContext nos componentes.
export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects deve ser usado dentro de ProjectsProvider.');
  }
  return context;
}
