const { poolConnect, pool } = require("./connection");
require("dotenv").config();

const force = false; // Altere para false se não quiser dropar as tabelas

async function seed() {
  try {
    await poolConnect;

    if (force) {
      console.log("⚠️ Forçando recriação das tabelas...");

      await pool.request().query(`
        IF OBJECT_ID('MessageRecipients', 'U') IS NOT NULL DROP TABLE MessageRecipients;
        IF OBJECT_ID('Messages', 'U') IS NOT NULL DROP TABLE Messages;
        IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
        IF OBJECT_ID('Departments', 'U') IS NOT NULL DROP TABLE Departments;
        IF OBJECT_ID('Positions', 'U') IS NOT NULL DROP TABLE Positions;
      `);

      console.log("🗑️ Tabelas antigas deletadas.");
    }

    console.log("🌱 Criando tabelas...");

    await pool.request().query(`
      -- Departments
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Departments')
      BEGIN
        CREATE TABLE Departments (
          id INT PRIMARY KEY IDENTITY(1,1),
          name NVARCHAR(100) NOT NULL
        );
      END;

      -- Positions
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Positions')
      BEGIN
        CREATE TABLE Positions (
          id INT PRIMARY KEY IDENTITY(1,1),
          name NVARCHAR(100) NOT NULL
        );
      END;

      -- Users
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
      BEGIN
        CREATE TABLE Users (
          id INT PRIMARY KEY IDENTITY(1,1),
          name NVARCHAR(100) NOT NULL,
          email NVARCHAR(100) NOT NULL UNIQUE,
          password NVARCHAR(255) NOT NULL,
          state NVARCHAR(100) NOT NULL,
          city NVARCHAR(100) NOT NULL,
          department_id INT,
          position_id INT,
          FOREIGN KEY (department_id) REFERENCES Departments(id),
          FOREIGN KEY (position_id) REFERENCES Positions(id)
        );
      END;

      -- Messages
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Messages')
      BEGIN
        CREATE TABLE Messages (
          id INT PRIMARY KEY IDENTITY(1,1),
          title NVARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          created_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (created_by) REFERENCES Users(id)
        );
      END;

      -- MessageRecipients
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MessageRecipients')
      BEGIN
        CREATE TABLE MessageRecipients (
          id INT PRIMARY KEY IDENTITY(1,1),
          message_id INT NOT NULL,
          user_id INT NOT NULL,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (message_id) REFERENCES Messages(id),
          FOREIGN KEY (user_id) REFERENCES Users(id)
        );
      END;
    `);

    console.log("✅ Tabelas criadas com sucesso.");

    console.log("📥 Inserindo dados iniciais...");

    await pool.request().query(`
      INSERT INTO Departments (name)
      VALUES ('TI'), ('RH'), ('Comercial');

      INSERT INTO Positions (name)
      VALUES ('Admin'), ('Gestor'), ('Colaborador');

      INSERT INTO Users (name, email, password, city, state, department_id, position_id)
      VALUES 
      ('Admin User', 'admin@example.com', 'admin123', 'Cuiabá', 'MT', 1, 1),
      ('Gestor RH', 'gestor@example.com', 'gestor123', 'São Paulo', 'SP', 2, 2),
      ('Colaborador Comercial', 'colab@example.com', 'colab123', 'Belo Horizonte', 'MG', 3, 3);


      INSERT INTO Messages (title, content, created_by)
      VALUES 
        ('Mensagem geral', 'Esta é uma mensagem para todos.', 1),
        ('Aviso do RH', 'RH informa novo benefício.', 2),
        ('Promoção Comercial', 'Campanha relâmpago ativa!', 3);

      INSERT INTO MessageRecipients (message_id, user_id)
      VALUES
        (1, 1), (1, 2), (1, 3),
        (2, 2),
        (3, 3);
    `);

    console.log("🎉 Seed finalizada com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao rodar a seed:", err);
    process.exit(1);
  }
}

seed();
