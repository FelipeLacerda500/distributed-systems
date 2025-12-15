# CHAT
## Discentes
- GISELE NUBIA SANTOS OLIVEIRA (20213010431)
- FELIPE LACERDA FERNANDES DE ASSIS (20183025885)

## Requisitos

- Node.js
- npm
- Extensões (Visual Studio Code) - DotENV, Prisma

## Guia de execução

**1. Clonar o Repositório**

```bash
git clone https://github.com/FelipeLacerda500/distributed-systems.git
```

**2. Navegar até o Diretório do Serviço de Usuários**

```bash
cd ./distributed-systems/backend/user-service
```

**3. Instalar Dependências para o Serviço de Usuários**

```bash
npm install
```

**4. Executar migrações do Prisma para o Serviço de Usuários**

```bash
npm run migrate
```

**5. Iniciar o Servidor de Desenvolvimento para o Serviço de Usuários**

```bash
npm run dev
```

**6. Navegar até o Diretório do Serviço de Mensagens**

```bash
cd cd ./distributed-systems/backend/message-service
```

**7. Instalar Dependências para o Serviço de Mensagens**

```bash
npm install
```

**8. Executar migrações do Prisma para o Serviço de Mensagens**

```bash
npm run migrate
```

**9. Iniciar o Servidor de Desenvolvimento para o Serviço de Mensagens**

```bash
npm run dev
```

**10. Navegar até o Diretório das Interfaces (front-end)**

```bash
cd cd ./distributed-systems/frontend/chat-frontend
```

**11. Instalar Dependências para as Interfaces (front-end)**

```bash
npm install
```

**12. Iniciar o Servidor de Desenvolvimento para o Front-end**

```bash
npm run dev
```

## Testes

Para executar os testes, navegue até os diretórios dos serviços de Mensagens e Usuários e execute:

```bash
npm run test
```
