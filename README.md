# Live Preview
https://clickclick-dun.vercel.app/

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

# Documentação do Projeto: Gerenciador de Projetos

## 1. Visão Geral

O Gerenciador de Projetos é uma aplicação web desenvolvida para facilitar o cadastro, acompanhamento e organização de projetos. A aplicação permite aos usuários listar, criar, editar, remover, favoritar e buscar projetos de forma eficiente, com uma interface intuitiva e responsiva.

## 2. Funcionalidades Implementadas

O projeto atende aos seguintes requisitos e funcionalidades:

* **Listagem Dinâmica de Projetos:**
  * Exibição da lista de projetos cadastrados.
  * Apresentação de uma mensagem informativa quando nenhum projeto está cadastrado, incentivando a criação de um novo.
  * Exibição do título da página ("Projetos") acompanhado da contagem total de projetos que correspondem aos filtros aplicados.

* **Filtragem Avançada e Ordenação:**
  * **Filtro de Favoritos:** Permite ao usuário visualizar apenas os projetos marcados como "favoritos".
  * **Ordenação Flexível:** Os projetos podem ser ordenados por:
    * **Ordem alfabética:** Pelo nome do projeto (padrão).
    * **Projetos iniciados mais recentemente:** Data de início decrescente.
    * **Projetos próximos à data de finalização:** Data de término crescente.

* **Gerenciamento Completo de Projetos (CRUD):**
  * **Criação de Projetos:** Uma página dedicada com formulário para adicionar novos projetos, incluindo campos como nome, cliente, data de início e data de término.
  * **Edição de Projetos:** Uma página similar à de criação, pré-preenchida com os dados do projeto selecionado, permitindo a atualização de suas informações.
  * **Remoção de Projetos:** Funcionalidade para excluir projetos, protegida por um modal de confirmação que exibe o nome do projeto a ser removido, prevenindo exclusões acidentais.

* **Interações com Projetos:**
  * **Favoritar/Desfavoritar:** Os usuários podem marcar ou desmarcar projetos como favoritos diretamente na listagem, com o estado refletido visualmente e na filtragem.

* **Busca Inteligente:**
  * **Barra de Busca Global:** Localizada no cabeçalho da aplicação, permite ao usuário buscar projetos por nome ou cliente. A busca é disparada automaticamente após a digitação de, no mínimo, 3 caracteres.
  * **(Opcional) Histórico de Buscas Recentes:** O campo de busca exibe as últimas 5 pesquisas realizadas pelo usuário, facilitando o acesso a buscas frequentes. Esta funcionalidade foi implementada localmente no componente de cabeçalho.
  * **(Opcional) Destaque nos Resultados:** O termo pesquisado é visualmente destacado nos cards dos projetos na lista de resultados, facilitando a identificação da correspondência.

## 3. Arquitetura da Solução

O projeto foi desenvolvido com as seguintes tecnologias e conceitos:

* **Frontend Framework:** Nuxt.js (Vue.js) - Utilizado para construir uma Single Page Application (SPA) reativa e componentizada.
* **Linguagem:** TypeScript - Para adicionar tipagem estática ao JavaScript, aumentando a robustez e a manutenibilidade do código.
* **Gerenciamento de Estado:** Pinia - Adotado como a store oficial para Vue.js, centralizando o estado da aplicação (lista de projetos, filtros, estado de loading, etc.) e a lógica de negócios relacionada.
* **Persistência de Dados:** Firebase Firestore - Utilizado como banco de dados NoSQL na nuvem para armazenar e recuperar os dados dos projetos de forma assíncrona.
* **Estilização:** Tailwind CSS - Framework CSS utility-first para a criação rápida de interfaces customizadas e responsivas.
* **Componentização:** A interface foi dividida em componentes reutilizáveis (ex: `ProjectCard`, `ProjectForm`, `ConfirmationModal`, `Header`), promovendo a organização e a reutilização de código.

## 4. Componentes Principais

* **`pages/index.vue` (ou similar para listagem):** Responsável por exibir a lista de projetos, controles de filtro, ordenação e o link para a página de criação. Interage intensamente com a store Pinia para obter e apresentar os dados.
* **`pages/projetos/novo.vue`:** Contém o formulário (`ProjectForm`) para a criação de novos projetos.
* **`pages/projetos/editar/[id].vue` (suposição de rota):** Contém o formulário (`ProjectForm`) para a edição de projetos existentes.
* **`components/Header.vue`:** Exibe o título da aplicação e a barra de busca global, incluindo o histórico de buscas recentes. Interage com a store para definir o termo de busca.
* **`components/ProjectCard.vue`:** Componente para exibir as informações de um único projeto na listagem. Inclui funcionalidades para favoritar, disparar a edição e a remoção do projeto, além de destacar o termo buscado.
* **`components/ProjectForm.vue`:** Formulário reutilizável para a criação e edição de projetos, lidando com a entrada de dados e validações.
* **`components/ConfirmationModal.vue`:** Modal genérico para confirmação de ações críticas, utilizado especificamente para a remoção de projetos.

## 5. Gerenciamento de Estado com Pinia (`stores/projects.ts`)

A store Pinia (`useProjectsStore`) é o cérebro da aplicação, gerenciando todo o ciclo de vida dos dados dos projetos e os estados da UI relacionados.

* **Estado (`state`):**
  * `projects`: Array contendo a lista de todos os projetos.
  * `loading`: Booleano para indicar o estado de carregamento de dados.
  * `error`: Armazena mensagens de erro caso ocorram falhas nas operações.
  * `showFavoritesOnly`: Booleano que controla o filtro de favoritos.
  * `sortBy`: String que define o critério de ordenação atual.
  * `searchTerm`: String que armazena o termo de busca atual.

* **Ações (`actions`):**
  * `WorkspaceProjects()`: Busca a lista de projetos do Firestore.
  * `WorkspaceProjectById(id)`: Busca um projeto específico pelo ID.
  * `addProject(projectData)`: Adiciona um novo projeto ao Firestore e atualiza o estado.
  * `updateProject(id, projectData)`: Atualiza um projeto existente no Firestore e no estado.
  * `deleteProject(id)`: Remove um projeto do Firestore e do estado.
  * `toggleFavorite(id)`: Alterna o estado de "favorito" de um projeto.
  * `setSearchTerm(term)`: Define o termo de busca atual.
  * Outras actions para manipular `showFavoritesOnly` e `sortBy`.

* **Getters:**
  * `filteredAndSortedProjects`: Computa a lista de projetos a ser exibida, aplicando os filtros (favoritos, termo de busca) e a ordenação selecionada. Este é o principal getter consumido pelos componentes de listagem.

## 6. Detalhes da Implementação dos Desafios

* **Exibir lista inicial sem projetos / Título e total de projetos:**
  * Solução: A página de listagem verifica o tamanho de `store.filteredAndSortedProjects.length`. Se for 0, exibe uma mensagem. O título e a contagem são diretamente reativos aos dados da store.

* **Filtro para exibir apenas os projetos favoritos:**
  * Solução: Um input checkbox na página de listagem altera a propriedade `showFavoritesOnly` na store. O getter `filteredAndSortedProjects` utiliza essa propriedade para filtrar a lista.

* **Opção de ordenação da listagem:**
  * Solução: Um select na página de listagem altera a propriedade `sortBy` na store. O getter `filteredAndSortedProjects` aplica a lógica de ordenação correspondente.

* **Página com o formulário de edição/criação de projeto:**
  * Solução: Rotas e páginas dedicadas em Nuxt.js. O componente `ProjectForm` é reutilizado, recebendo um modo (`create` ou `edit`) e, no caso da edição, os dados iniciais do projeto. A submissão do formulário chama as actions `addProject` ou `updateProject` da store.

* **Modal de confirmação de remoção:**
  * Solução: O componente `ConfirmationModal` é controlado por um estado local na página de listagem (`showDeleteModal`, `projectToDelete`). Ao confirmar, a action `deleteProject` da store é chamada.

* **Favoritar/Desfavoritar:**
  * Solução: Um evento no `ProjectCard` chama uma função na página de listagem, que por sua vez invoca a action `toggleFavorite(projectId)` da store. A action atualiza o dado no Firestore e o estado do projeto na store.

* **Barra de busca (3+ caracteres):**
  * Solução: O `Header.vue` possui um input cujo valor é enviado para a action `setSearchTerm` da store. O getter `filteredAndSortedProjects` usa o `store.searchTerm` para filtrar os resultados, aplicando o filtro somente se o termo tiver 3 ou mais caracteres.

* **(Opcional) Histórico das últimas 5 pesquisas recentes:**
  * Solução: Implementado com uma variável reativa local no `Header.vue`, que armazena os últimos termos buscados.

* **(Opcional) Exibir um destaque no texto dos resultados:**
  * Solução: O `ProjectCard.vue` recebe o `store.searchTerm` como prop e utiliza uma lógica interna (provavelmente com `computed properties` ou métodos) para encontrar e destacar as ocorrências do termo no nome ou cliente do projeto, possivelmente usando `v-html` com manipulação de strings ou componentes dedicados para highlighting.

## 7. Conclusão

O projeto Gerenciador de Projetos implementa com sucesso um conjunto robusto de funcionalidades para o gerenciamento eficaz de projetos. A arquitetura baseada em Nuxt.js, Pinia e Firebase Firestore provou ser uma escolha sólida, permitindo um desenvolvimento componentizado, reativo e escalável.
