# API de Gestão de Notas

- Aplicação hospedada: [Gestão de Notas](https://w-client.vercel.app/)
- App Next (Frontend): [Repositório do App](https://github.com/Brunogomes97/w_client)
- Repositório da API: [w\_server](https://github.com/Brunogomes97/w_server.git)

Este projeto é uma API desenvolvida com Nest.js para um aplicativo de gestão de notas. Ele fornece funcionalidades para gerenciamento seguro e eficiente de informações relacionadas ao sistema. A API está hospedada com redirecionamento de um servidor Nginx e conta com um script para entrega contínua.

## Tecnologias Utilizadas

- **Nest.js** (Framework backend para Node.js)
- **Prisma ORM** (Mapeamento objeto-relacional para PostgreSQL)
- **PostgreSQL** (Banco de dados relacional)
- **JWT** (Autenticação baseada em tokens)
- **Bcrypt** (Criptografia de senhas)
- **Class Validator e Class Transformer** (Validação e transformação de objetos)
- **Dotenv** (Gerenciamento de variáveis de ambiente)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Brunogomes97/w_server.git
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd w_server
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```
4. Sincronize com as migrações do banco de dados
 ```bash
   npx prisma generate            # Gerar o Prisma Client atualizado
   npx prisma migrate deploy      # Aplicar as migrações ao banco de dados 
   ```
6. Configure as variáveis de ambiente no arquivo `.env` com os seguintes campos:

   ```env
   DATABASE_URL=postgresql://admin:admin@localhost:5432/gestao_notas
   JWT_SECRET=sua_chave_secreta
   CLIENT_URL=link_do_app_next
   JWT_EXPIRES_IN=30d
   ```

7. Suba um banco de dados PostgreSQL utilizando Docker:

   ```bash
   docker run --name postgresDB -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=gestao_notas -p 5432:5432 -d postgres
   ```

## Executando o Projeto

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

## Testes

Para rodar os testes unitários:

```bash
npm run test
````

## Estrutura do Projeto

```
.github/workflows/
  |-- main.yml
/dist/
/node_modules/
/prisma/
/src/
  |-- config/      # Configurações do sistema
  |-- db/          # Conexão com o banco de dados
  |-- errors/      # Manipulação de erros
  |-- filters/     # Filtros globais para requisições
  |-- modules/     # Módulos da aplicação
  |-- types/       # Tipos e interfaces
  |-- app.controller.ts  # Controlador principal
  |-- app.module.ts      # Módulo principal
  |-- app.service.ts     # Serviços principais
  |-- main.ts            # Arquivo de inicialização da aplicação
/test/  # Testes unitários e de integração
```

## Licença

Este projeto está sob a licença MIT.

