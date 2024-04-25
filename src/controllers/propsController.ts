import { executeQuery } from "../models/mysql";
import * as mysql from "mysql2";

export type PropsOpc = "classe" | "raca" | "item" | "habilidade";

type PostProp = {
  nome: string;
  descricao: string;
};

export async function getProp(prop: PropsOpc) {
  try {
    const query = `SELECT * FROM ${prop}`;
    const data = await executeQuery(mysql.format(query));
    return {
      status: 200,
      data: data,
    };
  } catch (err) {
    return {
      status: 500,
      data: { message: "Erro desconhecido" },
    };
  }
}

export async function postProp(prop: PropsOpc, { nome, descricao }: PostProp) {
  if (!nome || !descricao) {
    let missingFields = [];
    if (!nome) missingFields.push("nome");
    if (!descricao) missingFields.push("descricao");
    return {
      status: 400,
      data: {
        message: `${missingFields.join(" e ")} não informado(s)`,
      },
    };
  }

  try {
    const query = "INSERT INTO ?? (nome, descricao) VALUES (?, ?)";
    const formattedQuery = mysql.format(query, [prop, nome, descricao]);
    await executeQuery(formattedQuery);
    return {
      status: 201,
      data: { message: "Registro inserido com sucesso" },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Erro ao inserir dados" },
    };
  }
}
