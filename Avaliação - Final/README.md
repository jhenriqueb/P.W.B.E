# iMoney - Sistema de Gestão de Operações Financeiras

Sistema completo para registro e acompanhamento de operações de compra e venda de ativos financeiros.

## Funcionalidades

### Sistema de Usuários
- **Cadastro de usuários**: Registro com validação de dados
- **Login/Logout**: Autenticação segura com sessões
- **Validação de dados**: Username, email, senha e informações pessoais

### Sistema de Operações
- **Registro de operações**: Compra e venda de ativos
- **Cálculo automático**: Taxas B3 e valores líquidos
- **Listagem de operações**: Histórico completo por usuário
- **Validação de dados**: Código do ativo, quantidade, preço e data

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS
- **Banco de Dados**: PostgreSQL
- **Autenticação**: bcryptjs, express-session
- **Validação**: validator.js
- **Estilização**: CSS puro com design responsivo

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd iMoney
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados PostgreSQL:
   - Crie um banco de dados
   - Execute o script `database_creation.sql` para criar as tabelas
   - Configure a conexão no arquivo `db/postgres.js`

4. Inicie o servidor:
```bash
npm start
```

5. Acesse o sistema em: `http://localhost:3000`

## Estrutura do Projeto

```
iMoney/
├── controllers/          # Controladores da aplicação
│   ├── operacao.controller.js
│   └── usuario.controller.js
├── db/                   # Configuração do banco de dados
│   └── postgres.js
├── models/               # Modelos de dados
│   ├── operacao.js
│   └── usuario.js
├── public/               # Arquivos estáticos
│   └── stylesheets/
├── routes/               # Rotas da aplicação
│   └── router.js
├── views/                # Templates EJS
│   ├── layout.ejs
│   ├── pages/
│   └── partials/
├── index.js              # Arquivo principal
└── package.json
```

## Páginas do Sistema

### Páginas Públicas
- **Home** (`/`): Página inicial com informações do sistema
- **Login** (`/user/login`): Formulário de autenticação
- **Cadastro** (`/user/cadastro`): Formulário de registro

### Páginas Protegidas (requerem autenticação)
- **Nova Operação** (`/nova_operacao`): Formulário para registrar operação
- **Minhas Operações** (`/operacoes`): Lista de operações do usuário

## Funcionalidades de Segurança

- **Autenticação obrigatória**: Rotas protegidas por middleware
- **Senhas criptografadas**: Uso do bcryptjs para hash de senhas
- **Sessões seguras**: Gerenciamento de sessões com express-session
- **Validação de dados**: Validação completa de entrada de dados

## Validações Implementadas

### Usuário
- Username: 5-15 caracteres, alfanumérico
- Nome/Sobrenome: 3-30 caracteres, apenas letras
- Email: Formato válido de email
- Senha: 6-15 caracteres, alfanumérico
- Confirmação de senha

### Operação
- Data: Formato de data válido
- Ativo: Código no formato AAAA1-2 (ex: PETR4, VALE3)
- Tipo: Compra ou venda
- Quantidade: Número inteiro positivo
- Preço: Número real positivo

## Cálculos Automáticos

- **Valor Bruto**: Preço × Quantidade
- **Taxa B3**: 0,03% do valor bruto
- **Valor Líquido**: 
  - Compra: Valor Bruto + Taxa B3
  - Venda: Valor Bruto - Taxa B3

## Como Usar

1. **Primeiro acesso**: Cadastre-se no sistema
2. **Login**: Faça login com suas credenciais
3. **Registrar operação**: Acesse "Nova Operação" e preencha os dados
4. **Acompanhar**: Visualize suas operações em "Minhas Operações"
5. **Logout**: Saia do sistema quando terminar

## Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste todas as funcionalidades
5. Faça um pull request

## Licença

Este projeto está sob a licença ISC.
