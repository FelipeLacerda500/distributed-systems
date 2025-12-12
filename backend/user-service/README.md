# Expense Tracker API

#### Grupo 1: Clean Architecture com TypeScript e Node.js

- ALÉXIA CORDEIRO OLIVEIRA (20213008587)
- FELIPE LACERDA FERNANDES DE ASSIS (20183025885)
- IAN CARLOS AFONSO DA SILVA (201612040128)
- SAMYRIS ALVES RODRIGUES (20203008799)

## Requisitos

- Node.js - v22.6.0
- npm - 10.8.2
- Extensões (Visual Studio Code) - DotENV, Prisma

## Guia de execução

**1. Clonar o Repositório**

```bash
git clone https://github.com/FelipeLacerda500/expense-tracker-api.git
```

**2. Navegar até o Diretório do Projeto**

```bash
cd expense-tracker-api
```

**3. Instalar Dependências**

```bash
npm install
```

**4. Executar migrações do Prisma**

```bash
npm run migrate
```

**5. Iniciar o Servidor de Desenvolvimento**

```bash
npm run dev
```

## Rotas da API

- `GET /`: Listar todas as despesas.

- `GET /metrics`: Obter as métricas diárias e mensais das despesas.

- `GET /query`: Pesquisar por despesas baseadas no nome do produto/serviço associado à despesa ou no nome da pessoa que realizou o cadastro.

- `POST /`: Criar uma nova despesa.

- `DELETE /`: Deletar uma despesa com base no id.
