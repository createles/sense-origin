import "dotenv/config";
import pg from "pg";

// destructure Pool from pg methods
const { Pool } = pg;

// dynamically set pool configuration based on prod/dev
const poolConfig = process.env.DATABASE_URL
  // if production (Railway)
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  // if local development
  : {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    };

export default new Pool(poolConfig);