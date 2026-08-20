import os
from openai import OpenAI
from dotenv import load_dotenv
import time

load_dotenv()

api_key = os.getenv("API_IA")

if not api_key:
    raise RuntimeError("ERRO.")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)


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

        Cada competência deve receber uma nota múltipla de 40, entre 0 e 200.

        A nota final deve ser a soma das cinco competências.

        O comentário deve explicar de forma objetiva os pontos fortes e os pontos que precisam ser melhorados.

        O texto corrigido deve preservar as ideias originais do aluno, corrigindo problemas de gramática, coesão, clareza e construção textual.

        Não invente informações sobre a redação.
    """

    response = client.chat.completions.create(
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
    temperature=0.2,
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "correcao_redacao",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "nota": {"type": "integer"},
                    "competencia_1": {"type": "integer"},
                    "competencia_2": {"type": "integer"},
                    "competencia_3": {"type": "integer"},
                    "competencia_4": {"type": "integer"},
                    "competencia_5": {"type": "integer"},
                    "comentario": {"type": "string"},
                    "texto_corrigido": {"type": "string"}
                },
                "required": [
                    "nota",
                    "competencia_1",
                    "competencia_2",
                    "competencia_3",
                    "competencia_4",
                    "competencia_5",
                    "comentario",
                    "texto_corrigido"
                ],
                "additionalProperties": False
                }
            }
        }
    )

    conteudo = response.choices[0].message.content

    if not conteudo:
        raise RuntimeError("O modelo não retornou uma resposta.")
    execution_time = time.time() - start_time
    print("--- %s segundos ---" % execution_time)
    import json
    return json.loads(conteudo)