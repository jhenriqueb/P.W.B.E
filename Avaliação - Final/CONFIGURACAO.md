# Configuração do Sistema iMoney

## Configuração do Banco de Dados

1. **Crie um arquivo `.env` na raiz do projeto** com as seguintes variáveis:

```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=imoney

# Configurações da Sessão
SESSION_SECRET=iMoney-secret-key-change-in-production
```

2. **Configure o banco de dados PostgreSQL**:
   - Crie um banco de dados chamado `imoney`
   - Execute o script `database_creation.sql` para criar as tabelas

3. **Instale as dependências**:
```bash
npm install
```

4. **Inicie o servidor**:
```bash
npm start
```

## Estrutura do Banco de Dados

### Tabela `usuarios`
- `id`: Chave primária (SERIAL)
- `username`: Nome de usuário único (VARCHAR(50))
- `password`: Senha criptografada (VARCHAR(255))
- `email`: Email único (VARCHAR(100))
- `nome`: Nome do usuário (VARCHAR(100))
- `sobrenome`: Sobrenome do usuário (VARCHAR(100))

### Tabela `operacoes`
- `id`: Chave primária (SERIAL)
- `data`: Data da operação (DATE)
- `ativo`: Código do ativo (VARCHAR(6))
- `tipo_de_operacao`: Tipo (compra/venda) (VARCHAR(10))
- `quantidade`: Quantidade de ativos (INTEGER)
- `preco`: Preço unitário (NUMERIC(12,2))
- `valor_bruto`: Valor bruto da operação (NUMERIC(14,2))
- `taxa_b3`: Taxa B3 calculada (NUMERIC(10,2))
- `valor_liquido`: Valor líquido da operação (NUMERIC(14,2))
- `usuario_id`: Chave estrangeira para usuário (INTEGER)

## Validações do Banco

- Preço deve ser >= 0
- Quantidade deve ser > 0
- Taxa B3 deve ser >= 0
- Tipo de operação deve ser 'compra' ou 'venda'
- Valor bruto deve ser >= 0
- Valor líquido deve ser >= 0
- Username e email devem ser únicos
- Relacionamento entre operações e usuários com CASCADE DELETE

## Segurança

- **NUNCA** commite o arquivo `.env` no repositório
- Use senhas fortes para o banco de dados
- Em produção, use HTTPS e configure `SESSION_SECRET` adequadamente
- Configure `secure: true` nas sessões quando usar HTTPS 