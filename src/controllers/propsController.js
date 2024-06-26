import * as mysql from "mysql2";
import { executeQuery } from "../mysql.js";

const semDados = {
  status: 400,
  data: { message: "Sem dados necessários" },
};

function validaCampos({ nome, descricao }) {
  let missingFields = [];
  if (!nome) missingFields.push("nome");
  if (!descricao) missingFields.push("descricao");

  if (missingFields.length > 0) {
    throw new Error(
      "Campos obrigatórios faltando: " + missingFields.join(", ")
    );
  }

  return true;
}

export async function getProp(prop) {
  try {
    const query = `SELECT * FROM ??`;
    const data = await executeQuery(mysql.format(query, [prop]));
    return {
      status: data.length > 0 ? 200 : 204,
      data: data,
    };
  } catch (error) {
    return { status: 500, data: { message: error.message } };
  }
}

export async function postProp(prop, { nome, descricao }) {
  try {
    validaCampos({ nome, descricao });
    const query = "INSERT INTO ?? (nome, descricao) VALUES (?, ?)";
    const formattedQuery = mysql.format(query, [prop, nome, descricao]);
    await executeQuery(formattedQuery);
    return {
      status: 201,
      data: { message: "Registro inserido com sucesso" },
    };
  } catch (error) {
    return { status: 500, data: { message: error.message } };
  }
}

export async function putProp(prop, { nome, descricao, id }) {
  try {
    validaCampos({ nome, descricao });
    const query = `UPDATE ?? SET nome = ?, descricao = ? WHERE id = ?`;
    const formattedQuery = mysql.format(query, [prop, nome, descricao, id]);
    const result = await executeQuery(formattedQuery);
    if (result.affectedRows === 0) {
      return {
        status: 404,
        data: { message: "Registro não encontrado" },
      };
    }
    return {
      status: 200,
      data: { message: "Registro atualizado com sucesso" },
    };
  } catch (error) {
    return { status: 500, data: { message: error.message } };
  }
}

export async function deleteProp(prop, id) {
  if (id !== undefined) {
    try {
      const query = `DELETE FROM ?? WHERE id=?`;
      const formattedQuery = mysql.format(query, [prop, id]);

      const result = await executeQuery(formattedQuery);
      if (result.affectedRows === 0) {
        return {
          status: 404,
          data: { message: "Registro não encontrado" },
        };
      }
      return {
        status: 200,
        data: { message: "Registro excluído com sucesso" },
      };
    } catch (error) {
      return { status: 500, data: { message: error.message } };
    }
  }
  return semDados;
}
