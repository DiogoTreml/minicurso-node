import { createPool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();
const { DB_URL, DB_USER, DB_PASS, DATABASE } = process.env;

export const pool = createPool({
  connectionLimit: 10,
  host: DB_URL,
  user: DB_USER,
  password: DB_PASS,
  database: DATABASE,
});

export async function executeQuery(sql) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(sql);
    return results;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}
