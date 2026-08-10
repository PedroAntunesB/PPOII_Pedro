from flask import Blueprint, request, jsonify
from database import get_connection
from User import User
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

    return jsonify({
        "success": True,
        
        "tema": tema,
        
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

@redacao_routes.route("/get-redacoes")
@login_required
def get_old_redacoes():
    conn = get_connection()
    cursor = conn.cursor()
    user_id = current_user.id

    cursor.execute(
        "SELECT * FROM chats WHERE user_id = %s",
        (user_id, )
    )

    historico_redacoes = cursor.fetchall()

    if not historico_redacoes: 
        return jsonify({
            "success": False,
            "message": "Usuário não possui redações"
        }), 404

    return jsonify({
        "success": True,
        "historico": historico_redacoes
    }), 200