# Correção usando a API do Gemini
import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

load_dotenv()

api_key = os.getenv("API_IA")

if not api_key:
    raise RuntimeError("ERRO: A variável API_IA não foi encontrada.")

client = genai.Client(
    api_key=api_key
)

class CorrecaoRedacao(BaseModel):
    nota: int = Field(ge=0, le=1000)

    competencia_1: int = Field(ge=0, le=200)
    competencia_2: int = Field(ge=0, le=200)
    competencia_3: int = Field(ge=0, le=200)
    competencia_4: int = Field(ge=0, le=200)
    competencia_5: int = Field(ge=0, le=200)

    comentario: str
    texto_corrigido: str


def corrigir_redacao(texto: str, tema: str) -> dict:
    start_time = time.time()

    print("Corrigindo...")

    prompt = f"""
            Você é um corretor especializado em redações do ENEM.

            Analise a redação considerando as cinco competências oficiais da redação do ENEM.

            Tema:
            {tema}

            Redação:
            {texto}

            Critérios:

            Competência 1:
            Domínio da modalidade escrita formal da língua portuguesa.

            Competência 2:
            Compreensão da proposta de redação e desenvolvimento do tema dentro dos limites estruturais do texto dissertativo-argumentativo.

            Competência 3:
            Seleção, relação, organização e interpretação de informações, fatos, opiniões e argumentos.

            Competência 4:
            Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.

            Competência 5:
            Elaboração de proposta de intervenção para o problema abordado, respeitando os direitos humanos.

            REGRAS DE NOTAS:

            - Cada competência deve receber uma nota múltipla de 40.
            - Cada competência deve ter um valor entre 0 e 200.
            - A nota final deve ser a soma das cinco competências.
            - A nota final deve ser igual à soma de competencia_1, competencia_2,
              competencia_3, competencia_4 e competencia_5.

            REGRAS DA CORREÇÃO:

            - O comentário deve explicar objetivamente os pontos fortes e os pontos
              que precisam ser melhorados.
            - O texto corrigido deve preservar as ideias originais do aluno.
            - Corrija problemas de gramática, coesão, clareza e construção textual.
            - Não invente informações sobre a redação.
            - Retorne obrigatoriamente todos os campos do formato solicitado.
            - Seja o mais rigoroso possivel sem comprometer as outras regras de correção
        """

    response = client.models.generate_content(
        model="gemini-3.6-flash", # Deu as melhores respostas até agora!
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.1,
            response_mime_type="application/json",
            response_schema=CorrecaoRedacao,
        ),
    )

    if not response.text:
        raise RuntimeError("O modelo não retornou uma resposta.")

    resultado = CorrecaoRedacao.model_validate_json(
        response.text
    )

    execution_time = time.time() - start_time

    print(f"--- {execution_time:.2f} segundos ---")

    return resultado.model_dump()