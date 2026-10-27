# ProjectFlow — Gestão de Projetos e Tarefas

**Caso prático: Desenvolvimento de uma aplicação de gestão de projetos com TypeScript e React/Angular**  
**Empresa fictícia:** TechSolutions  
**Framework escolhido:** React com TypeScript

## 1. O que fiz neste trabalho?

Neste exercício desenvolvi uma pequena aplicação web que permite criar projetos e organizar as suas tarefas. Escolhi **React** porque quis praticar os componentes e os Hooks. Usei **TypeScript** para identificar erros de tipos enquanto programava.

### Funcionalidades implementadas

- **Dashboard:** lista os projetos e mostra o total de projetos, tarefas, tarefas concluídas e progresso global.
- **Projetos:** criar, visualizar, editar e eliminar projetos.
- **Tarefas:** adicionar, editar, eliminar e alterar o estado de cada tarefa.
- **Estados:** `pendente`, `em-progresso` e `concluida` (mostrados em português na interface).
- **Progresso:** calculado com base nas tarefas concluídas. Exemplo: 2 tarefas concluídas em 4 = 50%.
- **Validação:** mensagens de erro para campos vazios, demasiado curtos, demasiado longos ou datas inválidas.
- **Design:** layout responsivo com CSS e cores diferentes conforme o estado das tarefas.
- **Persistência:** a aplicação comunica com uma API REST simulada pelo `json-server`, que grava os dados em `db.json`.
- **Testes:** existem testes dos modelos, validação e componentes React.

## 2. Como executar (passo a passo)

**Pré-requisito:** instalar Node.js 20 ou superior e npm.

1. Descompactar o projeto e abrir a pasta `projetos-techsolutions` no VS Code.
2. Abrir o terminal nessa pasta e instalar as dependências:

   ```bash
   npm install
   ```

3. **Terminal 1 — iniciar a API REST simulada:**

   ```bash
   npm run api
   ```

   A API fica disponível em `http://localhost:3001/projects`.

4. **Terminal 2 — iniciar o React:**

   ```bash
   npm run dev
   ```

5. Abrir no navegador o endereço indicado pelo Vite (normalmente `http://localhost:5173`).

> **Importante:** os dois terminais devem ficar ligados. Se a API não estiver a funcionar, os projetos não serão carregados e aparecerá uma mensagem de erro.

### Executar os testes e verificar a compilação

```bash
npm test
npm run build
```

A pasta `dist/` gerada pelo build contém a versão preparada para publicação. A API deve continuar acessível para as operações de leitura e escrita.

## 3. Estrutura do código

```text
projetos-techsolutions/
├── db.json                      # Base de dados de exemplo (API simulada)
├── index.html                   # Página HTML principal
├── package.json                 # Dependências e comandos npm
├── vite.config.ts               # Configuração Vite e Vitest
├── tsconfig.json                # Configuração TypeScript
├── README.md                    # Este documento
├── RELATORIO.md                 # Relatório breve do aluno
└── src/
    ├── main.tsx                # Entrada da aplicação
    ├── App.tsx                 # Dashboard e gestão dos formulários
    ├── styles.css              # Estilos responsivos
    ├── components/             # Cartões, tarefas e formulários
    ├── context/                # Estado global (Context API)
    ├── domain/                 # Classes, interfaces e validação
    ├── hooks/                  # Hooks reutilizáveis
    ├── services/               # Pedidos HTTP à API REST
    └── test/                   # Configuração dos testes
```

## 4. Conceitos de TypeScript e React utilizados

### Classes, interfaces, herança e composição

- Criei as interfaces `ProjectData`, `TaskData`, `ProjectInput` e `TaskInput` para descrever os dados.
- Criei as classes `Project` e `Task`.
- Ambas herdam os atributos `id` e `createdAt` da classe base `Entity`. Este é um exemplo simples de **herança**.
- Um `Project` contém um conjunto de objetos `Task`, o que demonstra **composição**.
- A propriedade `progressPercent` calcula a percentagem das tarefas concluídas.
- Defini `TaskStatus` como uma união de tipos, permitindo apenas os três estados indicados no enunciado.

### Componentes e Hooks

- Os componentes `ProjectCard`, `TaskRow`, `ProjectForm`, `TaskForm` e `Modal` são reutilizáveis.
- Usei `useState` para gerir os formulários, `useEffect` para carregar os dados e `useMemo` para os indicadores.
- Usei **Context API** em `ProjectContext.tsx` para partilhar o estado dos projetos entre os componentes.
- Criei os **Custom Hooks** `useProjects` e `useProjectSummary` para reutilizar lógica. No React, estes Hooks cumprem o objetivo de reutilização modular referido na secção de decorators do exercício.

### API REST

Os dados são guardados pelo JSON Server no ficheiro `db.json`.

| Operação | Método HTTP | Endpoint |
| --- | --- | --- |
| Listar projetos | GET | `/projects` |
| Criar projeto | POST | `/projects` |
| Editar projeto | PUT | `/projects/:id` |
| Eliminar projeto | DELETE | `/projects/:id` |
| Criar/editar/eliminar tarefa | PUT | `/projects/:id` |


## 5. Como testar manualmente

1. Criar um projeto chamado "Website" com uma descrição.
2. Adicionar duas tarefas com datas previstas.
3. Marcar uma das tarefas como "Concluída" e observar o progresso mudar para **50%**.
4. Editar o título de uma tarefa e confirmar que a alteração aparece na lista.
5. Experimentar criar um projeto com nome de uma letra para visualizar a mensagem de validação.
6. Recarregar a página para confirmar que os dados continuam guardados.
7. Experimentar os filtros "Pendente", "Em progresso" e "Concluída".
8. Eliminar uma tarefa e um projeto, confirmando as mensagens de aviso.


**Tecnologias principais:** HTML, CSS, TypeScript, React, Context API, Vite, JSON Server e Vitest.
