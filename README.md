# PRAESTITIA

Sistema de gerenciamento de leads e clientes com dashboard integrado.

## Pré-requisitos

- Python 3.8+
- Node.js 16+
- npm ou yarn

## Instalação

### Backend (Django)

1. Entre na pasta do backend:
```bash
cd backend
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Execute as migrações:
```bash
python manage.py migrate
```

5. Inicie o servidor:
```bash
python manage.py runserver 127.0.0.1:5000
```

### Frontend (React + Vite)

1. Na raiz do projeto, instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Ou execute tudo junto:
```bash
npm run dev  # Inicia frontend e backend simultaneamente
```

## Dados de Teste

Para facilitar o desenvolvimento e testes, incluímos um script que gera dados.

### Gerar Dados de Teste

Execute o comando a partir da pasta `backend`:

```bash
cd backend
python manage.py gerar_dados_teste
```

### Opções Disponíveis

```bash
# Gerar quantidade personalizada
python manage.py gerar_dados_teste --leads 50 --clientes 30

# Limpar dados existentes antes de gerar novos
python manage.py gerar_dados_teste --limpar

# Ajuda com todas as opções
python manage.py gerar_dados_teste --help
```

### Parâmetros

- `--leads N`: Número de leads para gerar (padrão: 20)
- `--clientes N`: Número de clientes para gerar (padrão: 15)
- `--limpar`: Remove todos os dados existentes antes de gerar novos


## Estrutura do Banco de Dados

O projeto utiliza SQLite em desenvolvimento. As tabelas são criadas automaticamente através das migrações do Django.

### Principais Entidades

- **Users**: Usuários do sistema com autenticação Knox
- **Leads**: Leads em prospecção
- **Clientes**: Clientes cadastrados

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- Tailwind CSS
- React Router

### Backend
- Django 5.2
- Django Knox (autenticação)
- SQLite
- Django CORS Headers

## Biblioteca de Componentes

Interface baseada em: MaterialUI e DaisyUI
