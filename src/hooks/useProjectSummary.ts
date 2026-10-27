import { useMemo } from 'react';
import type { Project } from '../domain/models';

// Exemplo adicional de Custom Hook: cálculo reutilizável dos indicadores.
export function useProjectSummary(projects: Project[]) {
  return useMemo(() => {
    const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
    const completedTasks = projects.reduce((sum, project) => sum + project.completedTasks, 0);
    return {
      totalProjects: projects.length,
      totalTasks,
      completedTasks,
      progress: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
    };
  }, [projects]);
}
