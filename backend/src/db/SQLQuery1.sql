
create database disbravaMain
CREATE LOGIN user_developer WITH PASSWORD = '123123';

-- Criar usu�rio no banco espec�fico (substitua NOME_DO_BANCO)
--OBS: não pode ter letars maiúsculas na criação de usuárioManager
USE disbravaMain;
CREATE USER user_developer FOR LOGIN user_developer;

-- Dar permiss�es (opcional: db_owner, leitura, escrita, etc)
ALTER ROLE db_owner ADD MEMBER user_developer;
-- ou:
-- ALTER ROLE db_datareader ADD MEMBER meu_usuario;
-- ALTER ROLE db_datawriter ADD MEMBER meu_usuario;

CREATE TABLE Departments (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Position (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL,
    state NVARCHAR(100) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    position_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(id),
    FOREIGN KEY (position_id) REFERENCES Position(id)
);

CREATE TABLE Messages (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_by INT,
    FK_Messages_Users INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES User(id)
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE MessageRecipients (
    id INT PRIMARY KEY IDENTITY(1,1),
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (message_id) REFERENCES Messages(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);




DB_USER=user_developer
DB_PASSWORD=123123
DB_SERVER=localhost
DB_DATABASE=disbravaMain
JWT_SECRET=jwt123
EMAIL_USER=eric@gmail.com
EMAIL_PASS=123123