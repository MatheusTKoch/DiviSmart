# DiviSmart

DiviSmart é uma aplicação web desenvolvida em [**VueJS**](https://vuejs.org/) que centraliza o gerenciamento e análise de ativos financeiros. O sistema possibilita o cadastro e a visualização de ações, fundos imobiliários, tesouro direto e dividendos, gerando também relatórios de valorização dos ativos. Os dados dos ativos e dividendos são armazenados em [**MySQL**](https://www.mysql.com/), enquanto informações atualizadas – como cotações e dados de valorização – são obtidas por web scraping com [**Cheerio**](https://cheerio.js.org/).

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
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

## Recursos

- **Interface VueJS:** Front-end dinâmico e responsivo.
- **Banco de Dados MySQL:** Armazenamento seguro e eficiente dos dados.
- **Scraping com Cheerio:** Coleta de dados financeiros e cotações atualizadas.
- **Relatórios Financeiros:** Visualização de valorização e desempenho dos ativos. (Em progresso)

## Tecnologias

- **Front-end:** VueJS, Vite
- **Back-end/Scripts:** Node.js
- **Banco de Dados:** MySQL
- **Web Scraping:** Cheerio, Axios

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [npm](https://www.npmjs.com/)
- Servidor MySQL (local ou na nuvem)
- Configuração de fontes para web scraping (conforme políticas de uso das fontes escolhidas)

## Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/MatheusTKoch/DiviSmart.git
cd DiviSmart
```

### 2. Instale as Dependências do Front-end

```bash
npm install
```

### 3. Execução dos Scripts de Banco

Na pasta database você encontrará os arquivos para criação das tabelas (com final table.js) e scripts para inserir dados iniciais (com final dados.js). Para executar a configuração do banco:

Acesse a pasta database:

```bash
cd src
cd scripts
cd database
```

Execute o script principal:

```bash
    node script.js
```

Este comando irá:

- Criar o banco de dados
- Criar todas as tabelas necessárias
- Inserir dados iniciais via web scraping

### 4. Próximos Passos

- **Finalizar a Seção de Relatórios:** Implementar gráficos interativos e exportação de dados.
- **Atualização Automática de Cotações:** Configurar web scraping periódico para atualização dos valores dos ativos.
- **Aprimoramento da UX/UI:** Melhorar a responsividade, adicionar animações e feedbacks visuais.
- **Hospedagem Pública:** Planejar a implantação para que o projeto seja acessível publicamente.