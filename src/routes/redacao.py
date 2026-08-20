from flask import Blueprint, request, jsonify
from ..database import get_connection
from ..User import User
from flask_login import login_required, current_user
from ..ai import corrigir_redacao

redacao_routes = Blueprint("redacao", __name__)

@redacao_routes.route("/corrigir-redacao")
@login_required
def enviar_corrigir_redacao():

    redacao = request.args.get("redacao")
    tema = request.args.get("tema")
    nome = request.args.get("nome")

    if tema == "0" or tema == "":
        return jsonify({
            "success": False,
            "message": "É necessario selecionar um tema."
        }), 422

    if not nome: 
        return jsonify({
            "success": False,
            "message": "É necessário digitar um nome para a redação"
        }), 422

    if not redacao:
        return jsonify({
            "success": False,
            "message": "Nenhuma redação foi enviada."
        }), 422

    
    
    try:

        resultado = corrigir_redacao(
            texto=redacao,
            tema=tema
        )

        return jsonify({
            "success": True,
            "tema": tema,
            "nome_redacao": nome,
            "user_text": redacao,
            "correcao": resultado
        }), 200
    except Exception as error:

        print("Erro na IA:", error)

        return jsonify({
            "success": False,
            "message": "Não foi possível realizar a correção."
        }), 500

        
@redacao_routes.route("/get-all")
@login_required
def get_all_redacoes():
    conn = get_connection()
    cursor = conn.cursor()
    user_id = current_user.id

    cursor.execute(
        "SELECT tema, nome_redacao, id FROM chats WHERE user_id = %s",
        (user_id, )
    )

    historico_redacoes = cursor.fetchall()

    conn.close()
    cursor.close()

    if not historico_redacoes: 
        return jsonify({
            "success": False,
            "message": "Usuário não possui redações"
        }), 200

    return jsonify({
        "success": True,
        "historico": historico_redacoes
    }), 200


@redacao_routes.route("/get-redacoes")
@login_required
def get_old_redacoes():
    conn = get_connection()
    cursor = conn.cursor()
    user_id = current_user.id

    cursor.execute(
        "SELECT tema, nome_redacao, id FROM chats WHERE user_id = %s",
        (user_id, )
    )

    historico_redacoes = cursor.fetchmany(4)

    conn.close()
    cursor.close()

    if not historico_redacoes: 
        return jsonify({
            "success": False,
            "message": "Usuário não possui redações"
        }), 200

    return jsonify({
        "success": True,
        "historico": historico_redacoes
    }), 200

@redacao_routes.route("/post-redacao", methods=["POST"])
@login_required
def post_new_redacao():

    data = request.get_json()
    print(data)
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
            comentario,
            nome_redacao
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s, %s
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
            data["correcao"]["comentario"],
            data["nome_redacao"]
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Redação salva com sucesso."
    }), 201

@redacao_routes.route("/delete-redacao", methods=["DELETE"])
@login_required
def delete_redacao():
    id = current_user.id
    data = request.get_json()
    redacao_id = int(data["id"])

    if not redacao_id: 
        return jsonify({
            "success": False,
            "message": "ID invalido"
        }), 404
    
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM chats WHERE user_id=%s AND id=%s;", (id, redacao_id, ))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Redação excluida com sucesso"
    }), 201

@redacao_routes.route("/get-redacao")
@login_required
def get_redacao():

    data = request.args.get("id")

    if not data:
        return jsonify({
            "success": False,
            "message": "Dados incorretos."
        }), 422

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM chats
        WHERE id = %s AND user_id = %s
        """,
        (data, current_user.id)
    )

    redacao = cursor.fetchone()

    cursor.close()
    conn.close()

    if not redacao:
        return jsonify({
            "success": False,
            "message": "Redação não encontrada."
        }), 404

    return jsonify({
        "success": True,
        "redacao": {
        "id": redacao[0],

        "nome_redacao": redacao[13],

        "tema": redacao[5],

        "user_text": redacao[2],

        "data_criacao": redacao[4],

        "correcao": {
            "nota": redacao[6],

            "competencia_1": redacao[7],
            "competencia_2": redacao[8],
            "competencia_3": redacao[9],
            "competencia_4": redacao[10],
            "competencia_5": redacao[11],

            "comentario": redacao[12],

            "texto_corrigido": redacao[3]
        }}
    }), 200

@redacao_routes.route("/editar-redacao", methods=["PUT"])
@login_required
def editar_redacao():

    data = request.get_json()

    print(data)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE chats
        SET
            texto_user = %s,
            texto_llm = %s,
            tema = %s,
            nota = %s,
            competencia1 = %s,
            competencia2 = %s,
            competencia3 = %s,
            competencia4 = %s,
            competencia5 = %s,
            comentario = %s,
            nome_redacao = %s
        WHERE id = %s
          AND user_id = %s
        """,
        (
            data["user_text"],
            data["correcao"]["texto_corrigido"],
            data["tema"],
            data["correcao"]["nota"],
            data["correcao"]["competencia_1"],
            data["correcao"]["competencia_2"],
            data["correcao"]["competencia_3"],
            data["correcao"]["competencia_4"],
            data["correcao"]["competencia_5"],
            data["correcao"]["comentario"],
            data["nome_redacao"],
            data["id"],
            current_user.id
        )
    )

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()

        return jsonify({
            "success": False,
            "message": "Redação não encontrada."
        }), 404

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Redação atualizada com sucesso."
    }), 200