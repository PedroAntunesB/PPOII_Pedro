CREATE TABLE Chats (
  id SERIAL PRIMARY KEY,
  user_id INT,
  texto_user TEXT NOT NULL,
  texto_llm TEXT NOT NULL,
  data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  tema VARCHAR(100),
  nota INT, 
  competencia1 INT,
  competencia2 INT,
  competencia3 INT,
  competencia4 INT,
  competencia5 INT,
  comentario TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
