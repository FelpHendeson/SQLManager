# SQLManager
Aplicação para auxiliar e facilitar a escrita e leitura de SQL.

## Monolito (API + banco + UI)

A aplicação é um **monolito** em TypeScript que expõe:
- **API** REST para consultar/criar catálogo.
- **Persistência MongoDB** para armazenar o catálogo.
- **UI simples** servida pelo próprio servidor via **EJS**.

## Pré-requisitos
- Node.js 18+
- MongoDB Atlas ou instância local

## Configuração
1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
2. Preencha as variáveis no `.env`:
   - `MONGODB_URI`
   - `MONGODB_DATABASE`
   - `PORT` (opcional)

## Rodando
```bash
npm install
npm run build
npm run start
```

## Fluxo de scripts
1. Acesse `http://localhost:3000`.
2. Informe o *database* e envie o arquivo SQL.
3. O sistema registra o script, separa blocos e lista dependências detectadas.

## Endpoints
- `GET /api/health`
- `GET /api/catalog`
- `POST /api/catalog/seed`
- `GET /api/scripts`
- `GET /api/scripts/:id`
- `POST /scripts/upload`

A UI básica fica disponível em `http://localhost:3000`.
