# Relatório do caso prático

## Desenvolvimento de uma aplicação de gestão de projetos com TypeScript e React

**Unidade:** CPT0040(01)  
**Empresa do enunciado:** TechSolutions

### 1. Introdução

Neste trabalho, o objetivo foi desenvolver uma aplicação que ajudasse uma empresa a organizar os seus projetos e tarefas. A ideia era construir uma primeira versão funcional, simples de compreender e que pudesse ser melhorada no futuro.

Optei por utilizar **React com TypeScript**. Já que o exercício permitia escolher React ou Angular, achei que React seria uma boa opção para aprender a dividir a interface em vários componentes.

### 2. O que foi desenvolvido

Criei um painel inicial onde aparecem os projetos existentes e alguns indicadores, como o número total de tarefas e quantas já estão concluídas. O utilizador pode adicionar projetos novos, editar os seus dados ou eliminá-los.

Dentro de cada projeto é possível criar tarefas com título, descrição, data prevista e estado. Os estados disponíveis são **Pendente**, **Em progresso** e **Concluída**. Quando uma tarefa passa para "Concluída", a percentagem de progresso do projeto é atualizada automaticamente.

Também incluí mensagens de erro nos formulários para evitar, por exemplo, nomes demasiado curtos ou datas inválidas. As tarefas têm cores diferentes para ser mais fácil perceber o seu estado.

### 3. Organização e tecnologias

Dividi o código em componentes para não colocar toda a lógica num único ficheiro. O React ficou responsável pela interface e o TypeScript ajudou a definir os tipos dos dados.

Usei interfaces e duas classes principais: `Project` e `Task`. Estas classes herdam propriedades de `Entity`, e cada projeto contém uma lista de tarefas. Desta forma, pratiquei **classes, interfaces, herança e composição**.

Para partilhar os projetos entre os componentes usei **Context API**. Criei ainda dois Hooks próprios, `useProjects` e `useProjectSummary`, para evitar repetir código. Preferi esta abordagem aos decorators porque escolhi trabalhar com React.

Para guardar os dados utilizei o **JSON Server**, que simula uma API REST. Os pedidos são feitos através de `fetch`, utilizando GET, POST, PUT e DELETE. Os dados ficam registados no ficheiro `db.json`.

### 4. Validação e testes

Implementei validações para verificar os campos dos projetos e das tarefas. Por exemplo, um nome de projeto não pode ter menos de três caracteres e a data da tarefa tem de existir no calendário.

Também escrevi testes com **Vitest** e **React Testing Library**. Os testes verificam o cálculo do progresso, a criação de objetos, as validações e o comportamento de componentes da interface. Para os executar, utiliza-se `npm test` depois de instalar as dependências.

### 5. Dificuldades e aprendizagem

Uma das partes mais interessantes foi perceber que não basta mostrar os dados no ecrã: também é necessário guardá-los para que continuem disponíveis depois de atualizar a página. Por isso separei a comunicação com a API do restante código.

Outra aprendizagem foi a importância da tipagem. Com TypeScript, consegui definir exatamente quais os campos obrigatórios de cada projeto e tarefa e limitar os estados possíveis.

### 6. Conclusão

Considero que o projeto cumpre os principais objetivos do caso prático: permite gerir projetos e tarefas, calcula o progresso, valida os formulários, utiliza React e TypeScript e guarda os dados numa API REST simulada.

Como melhoria futura, gostaria de adicionar utilizadores diferentes e permitir atribuir tarefas a cada membro da equipa. Para esta primeira versão, procurei dar prioridade ao funcionamento correto e à organização do código.

---

**Instruções de execução e estrutura dos ficheiros:** consultar `README.md`.
