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
    const personagemQuery = `
    SELECT p.*, 
           c.nome AS nome_classe, c.descricao AS descricao_classe, 
           r.nome AS nome_raca, r.descricao AS descricao_raca
    FROM personagens p
    JOIN classe c ON p.classe_id = c.id
    JOIN raca r ON p.raca_id = r.id
    WHERE p.id = ?;
  `;
    const personagem = await executeQuery(mysql.format(personagemQuery, [id]));
    if (personagem.length === 0) {
      return {
        status: 204,
        data: null,
      };
    }

    const habilidadesQuery = `
      SELECT h.nome, h.descricao
      FROM habilidade h
      JOIN personagem_habilidades ph ON h.id = ph.habilidade
      WHERE ph.personagem = ?;
    `;
    const habilidades = await executeQuery(
      mysql.format(habilidadesQuery, [id])
    );
    const { nome, nome_classe, descricao_classe, nome_raca, descricao_raca } =
      personagem[0];

    const dataRes = {
      nome: nome,
      classe: {
        nome: nome_classe,
        descricao: descricao_classe,
      },
      raca: {
        nome: nome_raca,
        descricao: descricao_raca,
      },
      habilidades: habilidades,
    };

    return {
      status: 200,
      data: dataRes,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      data: { message: "Erro ao processar a requisição" },
    };
  }
}

export async function postPersonagem({ nome, classe, raca, habilidades }) {
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

    if (classeExists.length === 0 || racaExists.length === 0) {
      return {
        status: 400,
        data: { message: "Classe ou raça fornecida não existe." },
      };
    }

    const personagemResult = await connection.query(
      `INSERT INTO personagens (nome, classe_id, raca_id) VALUES (?, ?, ?)`,
      [nome, classe, raca]
    );
    const personagemId = personagemResult[0].insertId;

    for (const habilidade of habilidades) {
      const [habilidadeExists] = await connection.query(
        `SELECT id FROM habilidade WHERE id = ?`,
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
    return { status: 500, data: { message: error.message } };
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
      `UPDATE personagens SET nome = ?, classe_id = ?, raca_id = ? WHERE id = ?`,
      [nome, classe, raca, id]
    );

    await connection.query(
      `DELETE FROM personagem_habilidades WHERE personagem = ?`,
      [id]
    );

    const habilidadePromises = habilidades.map(async (habilidade) => {
      const [habilidadeExists] = await connection.query(
        `SELECT id FROM habilidade WHERE id = ?`,
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

export async function deletePersonagem(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM personagem_habilidades WHERE personagem = ?`,
      [id]
    );

    const query = await connection.query(
      `DELETE FROM personagens WHERE id = ?`,
      [id]
    );

    if (query[0].affectedRows === 0) {
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
