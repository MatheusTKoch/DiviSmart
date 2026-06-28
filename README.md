# DiviSmart

DiviSmart é uma aplicação web para gestão e análise de ativos financeiros. A solução foi organizada como uma SPA em [Vue 3](https://vuejs.org/) com [Vite](https://vitejs.dev/), uma API em [Express](https://expressjs.com/) e uma camada de persistência em [PostgreSQL](https://www.postgresql.org/) com [Redis](https://redis.io/) para sessões. Os dados de mercado são atualizados por scripts de scraping com [Cheerio](https://cheerio.js.org/) e [Axios](https://axios-http.com/), enquanto o fluxo de autenticação usa sessões persistidas no Redis e envio de e-mail para redefinição de senha via Resend.

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Próximos Passos](#próximos-passos)

## Visão Geral

DiviSmart oferece uma interface moderna e responsiva para:

- **Cadastro e Gestão de Ativos:** Controle de ações, fundos imobiliários, tesouro direto e dividendos.
- **Web Scraping:** Coleta automatizada de cotações e dados financeiros de fontes confiáveis.
- **Relatórios de Valorização:** Geração de relatórios detalhados para análise do desempenho dos ativos.

## Arquitetura

A arquitetura do projeto foi definida para separar claramente interface, regras de negócio e persistência:

- **Front-end SPA:** a interface é construída em Vue 3, com roteamento cliente a cliente via Vue Router.
- **Back-end HTTP:** a API em Express concentra autenticação, recuperação de senha e acesso aos dados.
- **Persistência principal:** PostgreSQL armazena usuários, carteiras, ativos, dividendos e demais registros do domínio.
- **Sessões e estado efêmero:** Redis é usado como store de sessão com `connect-redis`.
- **Atualização de dados externos:** scripts Node executam setup do banco e scraping de fontes financeiras.
- **Execução em containers:** o ambiente é orquestrado com Docker Compose, com serviços separados para app, banco, Redis, setup e scraper.
- **Segurança de credenciais:** senhas são armazenadas com hash bcrypt e o fluxo de recuperação usa token temporário com expiração.

## Recursos

- **Interface VueJS:** Front-end dinâmico e responsivo.
- **Banco de Dados PostgreSQL:** Armazenamento dos dados de domínio.
- **Redis:** Gerenciamento de sessões e estado temporário.
- **Scraping com Cheerio:** Coleta de dados financeiros e cotações atualizadas.
- **Relatórios Financeiros:** Visualização de valorização e desempenho dos ativos.

## Tecnologias

- **Front-end:** Vue 3, Vite, Vue Router
- **Back-end/Scripts:** Node.js, Express
- **Banco de Dados:** PostgreSQL, Redis
- **Web Scraping:** Cheerio, Axios
- **Autenticação e sessão:** express-session, connect-redis, bcrypt
- **Containerização:** Docker, Docker Compose

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) e Docker Compose, ou PostgreSQL e Redis instalados localmente
- Configuração de fontes para web scraping (conforme políticas de uso das fontes escolhidas)

## Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/MatheusTKoch/DiviSmart.git
cd DiviSmart
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Suba a infraestrutura

Se preferir executar tudo em containers, use:

```bash
docker compose up --build
```

Isso inicia os serviços de PostgreSQL, Redis, setup do banco, scraper e a aplicação Express.

### 4. Execução local dos scripts de banco e scraping

O projeto também possui scripts para preparar o banco e atualizar os dados externos:

```bash
npm run db:setup
```

Esse comando cria as tabelas na primeira execução. Para rodar a atualização dos scrapers manualmente:

```bash
npm run scrape
```

Para iniciar a API localmente:

```bash
npm start
```

### 5. Próximos Passos

- **Finalizar a seção de relatórios:** ampliar a visualização dos dados com gráficos e exportação.
- **Automatizar o scraping:** evoluir o fluxo de atualização periódica dos dados de mercado.
- **Aprimorar a UX/UI:** refinar responsividade, animações e feedbacks visuais.
- **Evoluir a camada de API:** expandir regras de negócio e validações de domínio.
