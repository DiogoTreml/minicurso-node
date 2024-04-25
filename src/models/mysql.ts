import { createPool, Pool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

// Configuração da conexão com o banco de dados utilizando variáveis de ambiente
const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

export async function executeQuery(sql: string): Promise<any[]> {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(sql);
    return results as any[];
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}
