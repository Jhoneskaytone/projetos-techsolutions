import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProjectsProvider } from './context/ProjectContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProjectsProvider>
      <App />
    </ProjectsProvider>
  </React.StrictMode>
);
