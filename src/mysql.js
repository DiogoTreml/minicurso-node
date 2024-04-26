import { createPool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const pool = createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
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
