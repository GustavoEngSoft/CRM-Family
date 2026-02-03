import { query } from '../connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🔄 Executando migrations...');
    
    const migrationFile = path.join(__dirname, '../init.sql');
    const sql = fs.readFileSync(migrationFile, 'utf-8');
    
    await query(sql);
    
    console.log('✅ Migrations executadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  }
}

runMigrations();
