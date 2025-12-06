#!/bin/bash

# Script de preparação do banco de dados para o Praestitia

echo "=================================================="
echo "   PREPARAÇÃO DO BANCO DE DADOS - PRAESTITIA"
echo "=================================================="

DB_FILE="backend/db.sqlite3"

# Função para executar migrações
migrar() {
    echo "executando migrações..."
    cd backend
    python3 manage.py makemigrations
    python3 manage.py migrate
    cd ..
    echo "Migrações concluídas!"
}

# Verifica se o arquivo do banco já existe
if [ -f "$DB_FILE" ]; then
    echo "Arquivo de banco de dados encontrado: $DB_FILE"
    echo "O banco de dados já contém as tabelas necessárias."
    echo ""
    echo "Opções:"
    echo "1. Manter o banco atual e apenas aplicar novas migrações (Recomendado)"
    echo "2. APAGAR tudo e recriar o banco do zero (Cuidado! Dados serão perdidos)"
    echo "3. Sair"
    echo ""
    read -p "Escolha uma opção [1-3]: " opcao

    case $opcao in
        1)
            migrar
            ;;
        2)
            echo "ATENÇÃO: Você escolheu apagar o banco de dados."
            read -p "Tem certeza absoluta? (s/n): " confirma
            if [ "$confirma" = "s" ]; then
                echo "Removendo $DB_FILE..."
                rm "$DB_FILE"
                migrar
                echo "Banco de dados recriado com sucesso."
            else
                echo "Operação cancelada."
            fi
            ;;
        3)
            echo "Saindo..."
            exit 0
            ;;
        *)
            echo "Opção inválida."
            exit 1
            ;;
    esac
else
    echo "Arquivo de banco de dados não encontrado. Criando um novo..."
    migrar
fi

echo "=================================================="
echo "   PROCESSO FINALIZADO"
echo "=================================================="
