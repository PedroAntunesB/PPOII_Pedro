CREATE TABLE Chats (
  id SERIAL PRIMARY KEY,
  user_id INT,
  texto_user TEXT NOT NULL,
  texto_llm TEXT NOT NULL,
  data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);



/*
ADICIONAR!!!
CREATE TABLE chats (

    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL REFERENCES users(id),

    titulo VARCHAR(120),

    tema VARCHAR(100),

    texto_user TEXT NOT NULL,

    texto_llm TEXT,

    data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
*/