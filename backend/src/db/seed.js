const { poolConnect, pool } = require('./connection');

async function seed() {
  try {
    await poolConnect;

    console.log('🌱 Criando tabelas...');

    // Dropar as tabelas se já existirem (ordem reversa por causa das FKs)
    await pool.request().query(`
      IF OBJECT_ID('MessageRecipients', 'U') IS NOT NULL DROP TABLE MessageRecipients;
      IF OBJECT_ID('Messages', 'U') IS NOT NULL DROP TABLE Messages;
      IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
      IF OBJECT_ID('Departments', 'U') IS NOT NULL DROP TABLE Departments;
      IF OBJECT_ID('Position', 'U') IS NOT NULL DROP TABLE Position;
    `);

    // Criar tabelas
    await pool.request().query(`
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
        created_at DATETIME DEFAULT GETDATE()
      );

      CREATE TABLE MessageRecipients (
        id INT PRIMARY KEY IDENTITY(1,1),
        message_id INT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (message_id) REFERENCES Messages(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );
    `);

    console.log('✅ Tabelas criadas com sucesso.');

    // Inserir 10 departamentos e cargos
    for (let i = 1; i <= 10; i++) {
      await pool.request().query(`
        INSERT INTO Departments (name) VALUES ('Departamento ${i}');
        INSERT INTO Position (name) VALUES ('Cargo ${i}');
      `);
    }

    console.log('✅ Departamentos e cargos inseridos.');

    // Inserir 10 usuários
    for (let i = 1; i <= 10; i++) {
      await pool.request().query(`
        INSERT INTO Users (name, email, password, state, city, department_id, position_id)
        VALUES (
          'Usuário ${i}',
          'usuario${i}@teste.com',
          'senhaHash${i}',
          'Estado ${i}',
          'Cidade ${i}',
          ${i},
          ${i}
        );
      `);
    }

    console.log('✅ Usuários inseridos.');

    // Inserir 10 mensagens
    for (let i = 1; i <= 10; i++) {
      await pool.request().query(`
        INSERT INTO Messages (title, content)
        VALUES (
          'Mensagem ${i}',
          'Conteúdo da mensagem número ${i}'
        );
      `);
    }

    console.log('✅ Mensagens inseridas.');

        // Inserir destinatários para mensagens (2 usuários aleatórios por mensagem)
    for (let i = 1; i <= 10; i++) {
      const user1 = Math.floor(Math.random() * 10) + 1;
      let user2;
      do {
        user2 = Math.floor(Math.random() * 10) + 1;
      } while (user2 === user1); // evita repetir

      await pool.request().query(`
        INSERT INTO MessageRecipients (message_id, user_id)
        VALUES
          (${i}, ${user1}),
          (${i}, ${user2});
      `);
    }

    console.log('✅ Mensagens associadas a usuários (MessageRecipients inseridos).');

    console.log('🎉 Seed finalizada com sucesso!');

    process.exit(0);
  } catch (err) {
    console.error('Erro ao rodar a seed:', err);
    process.exit(1);
  }
  
}

seed();
