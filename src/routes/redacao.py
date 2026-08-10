from flask import Blueprint, request, jsonify
from ..database import get_connection
from ..User import User
from flask_login import login_required, current_user

redacao_routes = Blueprint("redacao", __name__)

@redacao_routes.route("/corrigir-redacao")
@login_required
def enviar_corrigir_redacao():

    redacao = request.args.get("redacao")
    tema = request.args.get("tema")

    if tema == "0" or tema == "":
        return jsonify({
            "success": False,
            "message": "É necessario selecionar um tema."
        }), 422

    if not redacao:
        return jsonify({
            "success": False,
            "message": "Nenhuma redação foi enviada."
        }), 422
    response = jsonify({
        "success": True,
        
        "tema": tema,

        "user_text": redacao,
        
        "correcao": {
            "nota": 920,

            "competencia_1": 180,
            "competencia_2": 200,
            "competencia_3": 180,
            "competencia_4": 180,
            "competencia_5": 180,

            "comentario": """
                Sua redação apresenta boa organização e desenvolvimento das ideias.
                Entretanto, há pequenos problemas de concordância e pontuação.

                Pontos positivos:
                - Boa introdução.
                - Argumentação consistente.
                - Conclusão adequada.

                Pontos a melhorar:
                - Revisar algumas construções gramaticais.
                - Utilizar conectivos de forma mais variada.
                - Desenvolver melhor o segundo argumento.
            """,

            "texto_corrigido": "Minha redação é muito boa."
        }
    })

    

    return response

@redacao_routes.route("/get-redacoes")
@login_required
def get_old_redacoes():
    conn = get_connection()
    cursor = conn.cursor()
    user_id = current_user.id

    cursor.execute(
        "SELECT tema, data_criacao FROM chats WHERE user_id = %s",
        (user_id, )
    )

    historico_redacoes = cursor.fetchmany(4)

    conn.close()
    cursor.close()

    if not historico_redacoes: 
        return jsonify({
            "success": False,
            "message": "Usuário não possui redações"
        }), 404

    return jsonify({
        "success": True,
        "historico": historico_redacoes
    }), 200

@redacao_routes.route("/post-redacao", methods=["POST"])
@login_required
def post_new_redacao():

    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO chats (
            user_id,
            texto_user,
            texto_llm,
            tema,
            nota,
            competencia1,
            competencia2,
            competencia3,
            competencia4,
            competencia5,
            comentario
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s
        )
        """,
        (
            current_user.id,
            data["user_text"],
            data["correcao"]["texto_corrigido"],
            data["tema"],
            data["correcao"]["nota"],
            data["correcao"]["competencia_1"],
            data["correcao"]["competencia_2"],
            data["correcao"]["competencia_3"],
            data["correcao"]["competencia_4"],
            data["correcao"]["competencia_5"],
            data["correcao"]["comentario"]
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Redação salva com sucesso."
    }), 201