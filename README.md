# SQLManager
Aplicação para auxiliar e facilitar a escrita e leitura de SQL.

## Monolito (API + banco + UI)

A aplicação é um **monolito** em TypeScript que expõe:
- **API** REST para consultar/criar catálogo.
- **Persistência MongoDB** para armazenar o catálogo.
- **UI simples** servida pelo próprio servidor.

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

## Endpoints
- `GET /api/health`
- `GET /api/catalog`
- `POST /api/catalog/seed`

A UI básica fica disponível em `http://localhost:3000`.
