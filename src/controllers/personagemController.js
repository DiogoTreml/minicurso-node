import * as mysql from "mysql2";
import { executeQuery, pool } from "../mysql.js";
import { statusErro } from "../util.js";

export async function getPersonagens() {
  try {
    const query = `SELECT id, nome FROM personagens`;
    const data = await executeQuery(mysql.format(query));
    return {
      status: data.length > 0 ? 200 : 204,
      data: data,
    };
  } catch (err) {
    return statusErro;
  }
}

export async function getPersonagemById(id) {
  try {
    const query = "SELECT * FROM personagens WHERE id=?";
    const data = await executeQuery(mysql.format(query, id));

    return {
      status: data.length > 0 ? 200 : 204,
      data: data.length > 0 ? data[0] : null,
    };
  } catch (err) {
    return statusErro;
  }
}

export async function postPersonagem({ nome, classe, raca, habilidades }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const classeExists = await connection.query(
      `SELECT id FROM classe WHERE id = ?`,
      [classe]
    );
    const racaExists = await connection.query(
      `SELECT id FROM raca WHERE id = ?`,
      [raca]
    );

    if (classeExists.length === 0 || racaExists.length === 0) {
      return {
        status: 400,
        data: { message: "Classe ou raça fornecida não existe." },
      };
    }

    const personagemResult = await connection.query(
      `INSERT INTO personagens (nome, classe, raca) VALUES (?, ?, ?)`,
      [nome, classe, raca]
    );
    const personagemId = personagemResult.insertId;

    for (const habilidade of habilidades) {
      const habilidadeExists = await connection.query(
        `SELECT id FROM habilidades WHERE id = ?`,
        [habilidade]
      );
      if (habilidadeExists.length === 0) {
        return { status: 400, data: { message: "Habilidade não existe." } };
      }

      await connection.query(
        `INSERT INTO personagem_habilidades (personagem, habilidade) VALUES (?, ?)`,
        [personagemId, habilidade]
      );
    }

    await connection.commit();
    return { status: 201, data: { message: "Registro criado." } };
  } catch (error) {
    await connection.rollback();
    return { status: 500, data: { message: "Erro desconhecido." } };
  } finally {
    connection.release();
  }
}

export async function putPersonagem({ id, nome, classe, raca, habilidades }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [classeExists] = await connection.query(
      `SELECT id FROM classe WHERE id = ?`,
      [classe]
    );
    const [racaExists] = await connection.query(
      `SELECT id FROM raca WHERE id = ?`,
      [raca]
    );
    const [personagemExists] = await connection.query(
      `SELECT id FROM personagens WHERE id = ?`,
      [id]
    );

    if (
      classeExists.length === 0 ||
      racaExists.length === 0 ||
      personagemExists.length === 0
    ) {
      return {
        status: 400,
        data: { message: "Classe, raça ou personagem não existem." },
      };
    }

    await connection.query(
      `UPDATE personagens SET nome = ?, classe = ?, raca = ? WHERE id = ?`,
      [nome, classe, raca, id]
    );

    await connection.query(
      `DELETE FROM personagem_habilidades WHERE personagem = ?`,
      [id]
    );

    const habilidadePromises = habilidades.map(async (habilidade) => {
      const [habilidadeExists] = await connection.query(
        `SELECT id FROM habilidades WHERE id = ?`,
        [habilidade]
      );
      if (habilidadeExists.length === 0) {
        throw new Error(`Habilidade ID ${habilidade} não existe.`);
      }

      return connection.query(
        `INSERT INTO personagem_habilidades (personagem, habilidade) VALUES (?, ?)`,
        [id, habilidade]
      );
    });

    await Promise.all(habilidadePromises);

    await connection.commit();
    return { status: 200, data: { message: "Registro atualizado." } };
  } catch (error) {
    await connection.rollback();
    return { status: 500, data: { message: "Erro desconhecido" } };
  } finally {
    connection.release();
  }
}

export async function deletePersonagem({ id }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM personagem_habilidades WHERE personagem = ?`,
      [id]
    );

    const { affectedRows } = await connection.query(
      `DELETE FROM personagens WHERE id = ?`,
      [id]
    );

    if (affectedRows === 0) {
      await connection.rollback();
      return { status: 404, data: { message: "Personagem não encontrado." } };
    }

    await connection.commit();
    return {
      status: 200,
      data: { message: "Personagem excluído com sucesso." },
    };
  } catch (error) {
    await connection.rollback();
    return { status: 500, data: { message: "Erro ao excluir personagem:" } };
  } finally {
    connection.release();
  }
}
