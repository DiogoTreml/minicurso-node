# Minicurso Node.js

Este repositório contém o código-fonte para op workshop de Node.js, utilizando Express, MySQL.

## Pré-requisitos

Antes de começar, você precisa ter o Node.js instalado em sua máquina. Se não tiver, você pode instalá-lo através do seguinte site:

- [Download Node.js](https://nodejs.org/)

## Configuração Inicial

Siga os passos abaixo para configurar seu ambiente de desenvolvimento:

1. Verifique se o Node.js foi instalado corretamente:
   ```bash
   node --version
2. Verifique se o npm foi instalado corretamente:
   ```bash
   npm --v

## Dependências
1. Inicie o projeto:
   ```bash
   npm init -y
   
2. Instale as dependências:
   ```bash
   npm install body-parser dotenv express mysql2

## Variáveis de Ambiente

1. **Criar o arquivo `.env`:** Na raiz do projeto, crie um arquivo chamado `.env`.

2. **Adicionar variáveis ao arquivo `.env`:** Abra o arquivo `.env` e adicione as seguintes variáveis, substituindo os valores de exemplo pelos reais conforme necessário:

   ```plaintext
   DB_HOST=localhost       # Endereço do servidor do banco de dados
   DB_USER=seu_usuario     # Usuário do banco de dados
   DB_PASS=sua_senha       # Senha do banco de dados
   DB_NAME=nome_do_banco   # Nome do banco de dados

   

   
