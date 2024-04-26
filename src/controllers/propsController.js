import * as mysql from "mysql2";
import { executeQuery } from "../mysql.js";
import { statusErro } from "../util.js";

const semDados = {
  status: 400,
  data: { message: "Sem dados necessários" },
};

function validaCampos({ nome, descricao }) {
  let missingFields = [];
  if (!nome) missingFields.push("nome");
  if (!descricao) missingFields.push("descricao");

  if (missingFields.length > 0) {
    return false;
  }
  return true;
}

export async function getProp(prop) {
  try {
    const query = `SELECT * FROM ${prop}`;
    const data = await executeQuery(mysql.format(query));
    return {
      status: data.length > 0 ? 200 : 204,
      data: data,
    };
  } catch (err) {
    return statusErro;
  }
}

export async function postProp(prop, { nome, descricao }) {
  const campos = validaCampos({ nome, descricao });
  if (campos) {
    try {
      const query = "INSERT INTO ?? (nome, descricao) VALUES (?, ?)";
      const formattedQuery = mysql.format(query, [prop, nome, descricao]);
      await executeQuery(formattedQuery);
      return {
        status: 201,
        data: { message: "Registro inserido com sucesso" },
      };
    } catch (error) {
      return statusErro;
    }
  } else {
    return semDados;
  }
}

export async function putProp(prop, { nome, descricao, id }) {
  const campos = validaCampos({ nome, descricao }) && id !== undefined;
  if (campos) {
    try {
      const query = `UPDATE ${prop} SET nome = ?, descricao = ? WHERE id = ?`;
      const formattedQuery = mysql.format(query, [nome, descricao, id]);
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
      return statusErro;
    }
  } else {
    return semDados;
  }
}

export async function deleteProp(prop, id) {
  if (id !== undefined) {
    try {
      const query = `DELETE FROM ${prop} WHERE id=?`;
      const formattedQuery = mysql.format(query, [id]);

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
      return statusErro;
    }
  }
  return semDados;
}
