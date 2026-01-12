# Backlog do Produto (MVP)

> Objetivo: registrar histórias curtas e critérios de aceitação para o MVP.

## Histórias

1. **Como usuário, quero autenticar com e-mail e senha para acessar minhas consultas salvas.**
   - Critérios de aceitação:
     - Dado que estou na tela de login, quando informo e-mail e senha válidos, então sou autenticado e redirecionado ao painel inicial.
     - Dado que informo credenciais inválidas, então vejo uma mensagem de erro clara e permaneço na tela de login.

2. **Como usuário, quero cadastrar uma conexão de banco (host, porta, usuário, senha) para poder consultar dados.**
   - Critérios de aceitação:
     - Quando salvo uma conexão com campos obrigatórios preenchidos, então a conexão aparece na lista de conexões.
     - Quando deixo um campo obrigatório em branco, então recebo validação indicando o campo faltante.

3. **Como usuário, quero testar a conexão antes de salvar para garantir que as credenciais estão corretas.**
   - Critérios de aceitação:
     - Ao clicar em “Testar conexão” com dados válidos, então recebo confirmação de sucesso.
     - Ao clicar em “Testar conexão” com dados inválidos, então recebo erro com mensagem descritiva.

4. **Como usuário, quero executar uma consulta SQL simples e ver os resultados em uma tabela.**
   - Critérios de aceitação:
     - Quando executo uma consulta válida, então vejo os resultados em uma tabela com colunas e linhas correspondentes.
     - Quando executo uma consulta inválida, então vejo o erro retornado pelo banco de forma legível.

5. **Como usuário, quero salvar consultas frequentes com nome e descrição para reutilizá-las.**
   - Critérios de aceitação:
     - Ao salvar uma consulta com nome, então ela aparece na lista de consultas salvas.
     - Ao tentar salvar sem nome, então o sistema exige o nome antes de salvar.

6. **Como usuário, quero visualizar e abrir uma consulta salva para editar ou reexecutar.**
   - Critérios de aceitação:
     - Ao selecionar uma consulta salva, então o editor é preenchido com o SQL correspondente.
     - Ao reexecutar a consulta salva, então vejo os resultados atualizados.

7. **Como usuário, quero exportar o resultado da consulta em CSV para compartilhar dados.**
   - Critérios de aceitação:
     - Quando clico em “Exportar CSV”, então o download inicia com o arquivo contendo os dados exibidos.
     - Quando não há resultados, então o sistema informa que não há dados para exportar.

8. **Como usuário, quero visualizar o histórico recente de consultas executadas para retomar trabalhos.**
   - Critérios de aceitação:
     - As últimas consultas executadas aparecem em ordem cronológica recente.
     - Ao clicar em um item do histórico, então o SQL correspondente é carregado no editor.
