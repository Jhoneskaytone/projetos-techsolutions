import { useEffect, useState } from 'react';
import { ProjectCard } from './components/ProjectCard';
import { ProjectForm } from './components/ProjectForm';
import { TaskForm } from './components/TaskForm';
import { TaskRow } from './components/TaskRow';
import { TASK_STATUS_LABELS, type Project, type Task, type TaskStatus } from './domain/models';
import { useProjectSummary } from './hooks/useProjectSummary';
import { useProjects } from './hooks/useProjects';

function App() {
  const {
    projects, loading, error, clearError, reload, addProject, editProject, deleteProject,
    addTask, editTask, deleteTask, changeTaskStatus
  } = useProjects();
  const summary = useProjectSummary(projects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'todas'>('todas');

  // Quando um projeto é eliminado, selecionamos o primeiro disponível.
  useEffect(() => {
    if (projects.length === 0) {
      setSelectedId(null);
    } else if (!selectedId || !projects.some((project) => project.id === selectedId)) {
      setSelectedId(projects[0].id);
    }
  }, [projects, selectedId]);

  const selectedProject = projects.find((project) => project.id === selectedId);
  const visibleTasks = selectedProject?.tasks.filter((task) => taskFilter === 'todas' || task.status === taskFilter) ?? [];

  function openNewProject() {
    setEditingProject(null);
    setShowProjectForm(true);
  }

  function openEditProject(project: Project) {
    setEditingProject(project);
    setShowProjectForm(true);
  }

  function openNewTask() {
    setEditingTask(null);
    setShowTaskForm(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setShowTaskForm(true);
  }

  async function confirmDeleteProject(project: Project) {
    if (window.confirm(`Eliminar o projeto "${project.name}" e todas as tarefas?`)) {
      try {
        await deleteProject(project.id);
      } catch { /* O erro é mostrado na página. */ }
    }
  }

  async function confirmDeleteTask(task: Task) {
    if (!selectedProject) return;
    if (window.confirm(`Eliminar a tarefa "${task.title}"?`)) {
      try {
        await deleteTask(selectedProject.id, task.id);
      } catch { /* O erro é mostrado na página. */ }
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-icon" aria-hidden="true">P</span>
            <span><strong>ProjectFlow</strong><small>TechSolutions · Projeto académico</small></span>
          </div>
          <div className="topbar-label"><span className="online-dot" /> Ambiente de demonstração</div>
        </div>
      </header>

      <main className="container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PAINEL DE CONTROLO</p>
            <h1>Gestão de projetos<span className="heading-period">.</span></h1>
            <p className="page-intro">Organize o trabalho da equipa e acompanhe cada tarefa num só lugar.</p>
          </div>
          <button className="button button-primary button-large" type="button" onClick={openNewProject}>
            <span aria-hidden="true">＋</span> Novo projeto
          </button>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠ {error}</span>
            <div className="error-actions">
              <button type="button" onClick={() => void reload()}>Tentar novamente</button>
              <button type="button" onClick={clearError} aria-label="Fechar aviso">×</button>
            </div>
          </div>
        )}

        <section className="stats-grid" aria-label="Indicadores dos projetos">
          <div className="stat-card"><span className="stat-icon icon-blue">▣</span><p>Projetos</p><strong>{summary.totalProjects}</strong><small>Em acompanhamento</small></div>
          <div className="stat-card"><span className="stat-icon icon-violet">☷</span><p>Tarefas</p><strong>{summary.totalTasks}</strong><small>No total</small></div>
          <div className="stat-card"><span className="stat-icon icon-green">✓</span><p>Concluídas</p><strong>{summary.completedTasks}</strong><small>Tarefas finalizadas</small></div>
          <div className="stat-card"><span className="stat-icon icon-orange">↗</span><p>Progresso geral</p><strong>{summary.progress}%</strong><small>Das tarefas existentes</small></div>
        </section>

        <div className="workspace-grid">
          <section className="panel projects-panel" aria-labelledby="projects-heading">
            <div className="panel-header">
              <div><p className="eyebrow">ORGANIZAÇÃO</p><h2 id="projects-heading">Os meus projetos <span className="count-pill">{projects.length}</span></h2></div>
            </div>
            {loading ? <p className="empty-state">A carregar projetos...</p> : (
              projects.length === 0
                ? <div className="empty-state"><strong>Ainda não existem projetos.</strong><p>Crie o primeiro para começar a organizar as tarefas.</p><button className="button button-outline" onClick={openNewProject}>Criar projeto</button></div>
                : <div className="projects-list">{projects.map((project) => (
                  <ProjectCard key={project.id} project={project} selected={project.id === selectedId}
                    onSelect={() => { setSelectedId(project.id); setTaskFilter('todas'); }}
                    onEdit={() => openEditProject(project)}
                    onDelete={() => void confirmDeleteProject(project)} />
                ))}</div>
            )}
          </section>

          <section className="panel details-panel" aria-labelledby="tasks-heading">
            {selectedProject ? (
              <>
                <div className="details-header">
                  <div><p className="eyebrow">DETALHES DO PROJETO</p><h2>{selectedProject.name}</h2><p>{selectedProject.description}</p></div>
                  <button className="button button-primary" type="button" onClick={openNewTask}>＋ Nova tarefa</button>
                </div>
                <div className="details-progress">
                  <div className="progress-caption"><span>Progresso do projeto</span><b>{selectedProject.progressPercent}%</b></div>
                  <div className="progress-track" role="progressbar" aria-label="Progresso do projeto selecionado"
                    aria-valuenow={selectedProject.progressPercent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-fill" style={{ width: `${selectedProject.progressPercent}%` }} />
                  </div>
                  <small>{selectedProject.completedTasks} de {selectedProject.tasks.length} tarefas concluídas</small>
                </div>
                <div className="tasks-toolbar">
                  <h2 id="tasks-heading">Tarefas <span className="count-pill">{selectedProject.tasks.length}</span></h2>
                  <label>Mostrar:
                    <select aria-label="Filtrar tarefas por estado" value={taskFilter}
                      onChange={(event) => setTaskFilter(event.target.value as TaskStatus | 'todas')}>
                      <option value="todas">Todas</option>
                      {Object.entries(TASK_STATUS_LABELS).map(([value, label]) =>
                        <option key={value} value={value}>{label}</option>
                      )}
                    </select>
                  </label>
                </div>
                {visibleTasks.length ? (
                  <div className="tasks-list">{visibleTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onEdit={() => openEditTask(task)}
                      onDelete={() => void confirmDeleteTask(task)}
                      onChangeStatus={(status) => changeTaskStatus(selectedProject.id, task.id, status)} />
                  ))}</div>
                ) : (
                  <div className="empty-state"><strong>Nenhuma tarefa para mostrar.</strong><p>Adicione uma tarefa ou escolha outro filtro.</p></div>
                )}
              </>
            ) : (
              <div className="details-placeholder"><span aria-hidden="true">▤</span><h2 id="tasks-heading">Selecione um projeto</h2><p>Os detalhes e as tarefas aparecem nesta área.</p></div>
            )}
          </section>
        </div>
        <footer className="footer">Projeto académico · React + TypeScript · Dados guardados na API REST simulada</footer>
      </main>

      {showProjectForm && (
        <ProjectForm key={editingProject?.id ?? 'novo'} project={editingProject ?? undefined}
          onClose={() => setShowProjectForm(false)}
          onSave={async (input) => {
            if (editingProject) await editProject(editingProject.id, input);
            else {
              const created = await addProject(input);
              setSelectedId(created.id);
            }
          }} />
      )}
      {showTaskForm && selectedProject && (
        <TaskForm key={editingTask?.id ?? 'nova'} task={editingTask ?? undefined}
          onClose={() => setShowTaskForm(false)}
          onSave={async (input) => {
            if (editingTask) await editTask(selectedProject.id, editingTask.id, input);
            else await addTask(selectedProject.id, input);
          }} />
      )}
    </div>
  );
}

export default App;
