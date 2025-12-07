# PRAESTITIA

Sistema de gerenciamento de leads e clientes com dashboard integrado.

## Sobre o Banco de Dados (SQLite)

Este projeto utiliza **SQLite** como banco de dados.

> **IMPORTANTE**: O arquivo do banco de dados (`backend/db.sqlite3`) **está incluído no repositório**.
> Isso significa que **as tabelas já estão criadas** e o ambiente está pronto para uso imediato após a instalação das dependências, sem necessidade de configuração complexa de banco de dados.

## Scripts de Gerenciamento

Para facilitar a manutenção do banco de dados, incluímos um script utilitário na raiz do projeto.

### `preparar_banco.sh`

Este script ajuda a gerenciar o estado do banco de dados.

**Como usar:**
```bash
./preparar_banco.sh
```

Ele oferecerá as seguintes opções:
1.  **Atualizar migrações**: Aplica quaisquer novas alterações de esquema sem perder dados.
2.  **Recriar do zero**: Exclui o arquivo `db.sqlite3` existente e recria todas as tabelas (Útil se quiser começar com um banco limpo).

---

## Instalação e Execução

### Pré-requisitos
- Python 3.8+
- Node.js 16+

### 1. Configurando o Backend (Django)

```bash
cd backend

# Criar e ativar ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate no Windows

# Instalar dependências
pip install -r requirements.txt

# (Opcional) Se quiser garantir que o banco está atualizado
python manage.py migrate

# Iniciar o servidor
python manage.py runserver
```

### 2. Configurando o Frontend (React + Vite)

Em um novo terminal, na raiz do projeto:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## Criando Usuário Administrador

Para acessar a página de gerenciamento de contas, é necessário um usuário com permissões de administrador:

```bash
cd backend
python manage.py create_admin
```

**Credenciais padrão:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@praestitia.com`

## Dados de Teste

Para popular o banco com dados fictícios para teste:

```bash
cd backend
python manage.py gerar_dados_teste --leads 20 --clientes 10
```

## Tecnologias

- **Frontend**: React, Vite, Tailwind CSS, Material-UI
- **Backend**: Django, Django Knox, SQLite
