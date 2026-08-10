class Chat:
    def __init__(
        self,
        id,
        texto_user,
        texto_llm,
        data_criacao_chat
    ):
        self.id = id
        self.texto_user = texto_user
        self.texto_llm = texto_llm
        self.data_criacao_chat = data_criacao_chat

        