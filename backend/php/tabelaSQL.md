## TABELA SQL

### 1. Clique em criar um novo banco de dados" 

### 2 . Copiar o código  abaixo. Após clicar no campo "SQL" e cole o código e execute aqui estamos criando o Banco de dados & Tabela.

```
CREATE DATABASE IF NOT EXISTS clientes;
USE clientes;

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(32) NOT NULL, 
    data_cadastro DATETIME NOT NULL,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

```