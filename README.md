# SQLManager
Aplicação para auxiliar e facilitar a escrita e leitura de SQL.

## Implementação inicial (TypeScript + MongoDB)

A base do projeto agora é em **TypeScript** e persiste o catálogo em **MongoDB**.
O acesso ao banco é configurado via variáveis de ambiente (sem credenciais no código).

### Pré-requisitos
- Node.js 18+
- MongoDB Atlas ou instância local

### Configuração
1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
2. Preencha as variáveis no `.env`:
   - `MONGODB_URI`
   - `MONGODB_DATABASE`

### Rodando o seed inicial
```bash
npm install
npm run build
node dist/index.js
```

O seed inicial cria um catálogo mínimo com uma base e um schema, seguindo as
pré-definições do modelo.
