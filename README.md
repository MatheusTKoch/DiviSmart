# DiviSmart

DiviSmart é uma aplicação web desenvolvida para gestão e análise de ativos financeiros, construída com uma stack de tecnologia moderna. Ela oferece uma interface responsiva para rastrear investimentos, automatizar a coleta de dados de mercado e gerar relatórios de desempenho.

## Table of Contents

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Instalação e Execução](#instalação-e-execução)
- [Screenshots](#screenshots)
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

Para executar o DiviSmart, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (v14 ou superior) e [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) e Docker Compose (recomendado para um ambiente de desenvolvimento completo), ou [PostgreSQL](https://www.postgresql.org/) e [Redis](https://redis.io/) instalados localmente.

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`, e preencha as variáveis de ambiente:

```
VITE_DATABASE_DB=
VITE_USER_DB=
VITE_PASSWORD_DB=
VITE_HOST_DB=
VITE_PORT_DB=
VITE_SESSION_SECRET=
VITE_PORT=
VITE_URL_ACOES=
VITE_URL_FII=
VITE_URL_TESOURO=
VITE_URL_COTACOES=
VITE_URL_ACOES_DIVIDENDOS=
VITE_URL_FII_DIVIDENDOS=
VITE_EMAIL_HOST=
VITE_EMAIL_PORT=
VITE_EMAIL_SECURE=
VITE_EMAIL_USER=
VITE_EMAIL_PASS=
VITE_EMAIL_FROM=
```
*   `VITE_DATABASE_DB`: Nome do banco de dados PostgreSQL.
*   `VITE_USER_DB`: Usuário do banco de dados PostgreSQL.
*   `VITE_PASSWORD_DB`: Senha do banco de dados PostgreSQL.
*   `VITE_HOST_DB`: Host do banco de dados PostgreSQL.
*   `VITE_PORT_DB`: Porta do banco de dados PostgreSQL.
*   `VITE_SESSION_SECRET`: Chave secreta para as sessões do Express.
*   `VITE_PORT`: Porta para a API do Express.
*   `VITE_URL_ACOES`, `VITE_URL_FII`, `VITE_URL_TESOURO`, `VITE_URL_COTACOES`, `VITE_URL_ACOES_DIVIDENDOS`, `VITE_URL_FII_DIVIDENDOS`: URLs para os scrapers.
*   `VITE_EMAIL_HOST`, `VITE_EMAIL_PORT`, `VITE_EMAIL_SECURE`, `VITE_EMAIL_USER`, `VITE_EMAIL_PASS`, `VITE_EMAIL_FROM`: Configurações para o serviço de envio de e-mail (Resend).

## Instalação e Execução

### 1. Clone o Repositório

```bash
git clone https://github.com/MatheusTKoch/DiviSmart.git
cd DiviSmart
```

### 2. Instale as Dependências

Instale as dependências do projeto:

```bash
npm install
```

### 3. Suba a infraestrutura com Docker Compose (Recomendado)

```bash
docker compose up --build
```

Isso inicia os serviços de PostgreSQL, Redis, setup do banco, scraper e a aplicação Express.

### 4. Execução local (Alternativa sem Docker Compose)

#### Configuração do Banco de Dados e Scraping

Para preparar o banco de dados e atualizar os dados externos:

```bash
npm run db:setup
npm run scrape
```

#### Iniciar a API do Express

```bash
npm start
```

#### Iniciar o Frontend (Vue.js)

```bash
npm run dev
```
O aplicativo estará disponível em `http://localhost:3000` (ou a porta configurada no Vite).

## Próximos Passos

- **Finalizar a seção de relatórios:** ampliar a visualização dos dados com gráficos e exportação.
- **Automatizar o scraping:** evoluir o fluxo de atualização periódica dos dados de mercado.
- **Aprimorar a UX/UI:** refinar responsividade, animações e feedbacks visuais.
- **Evoluir a camada de API:** expandir regras de negócio e validações de domínio.