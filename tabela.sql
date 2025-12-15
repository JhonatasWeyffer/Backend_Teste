/* Tabela para criar no Mysql */
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) UNIQUE,
    senha VARCHAR(255)
)