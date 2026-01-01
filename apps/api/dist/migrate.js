"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function runMigrations() {
    console.log('Running database migrations...');
    try {
        const migrationsDir = path_1.default.join(__dirname, '../migrations');
        const files = await promises_1.default.readdir(migrationsDir);
        const migrationFiles = files.filter(f => f.endsWith('.sql')).sort();
        for (const file of migrationFiles) {
            console.log(`Running migration: ${file}`);
            const sqlContent = await promises_1.default.readFile(path_1.default.join(migrationsDir, file), 'utf-8');
            await database_1.pool.query(sqlContent);
            console.log(`✓ Migration ${file} completed`);
        }
        console.log('All migrations completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
    finally {
        await database_1.pool.end();
    }
}
if (require.main === module) {
    runMigrations();
}
//# sourceMappingURL=migrate.js.map