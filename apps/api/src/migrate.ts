import fs from 'fs/promises';
import path from 'path';
import { pool } from './database';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter(f => f.endsWith('.sql')).sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const sqlContent = await fs.readFile(path.join(migrationsDir, file), 'utf-8');
      await pool.query(sqlContent);
      console.log(`✓ Migration ${file} completed`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}