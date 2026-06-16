import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', '..', 'data', 'almuna.db');
const dbDir = dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const SQL = await initSqlJs();
let sqlJsDb;

if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath);
  sqlJsDb = new SQL.Database(buffer);
} else {
  sqlJsDb = new SQL.Database();
}

function persist() {
  const data = sqlJsDb.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

const compat = {
  pragma(str) {
    sqlJsDb.run(`PRAGMA ${str}`);
  },
  exec(sql) {
    const result = sqlJsDb.exec(sql);
    persist();
    return result;
  },
  prepare(sql) {
    const s = sqlJsDb.prepare(sql);
    return {
      run(...params) {
        if (params.length > 0) s.bind(params);
        s.step();
        s.reset();
        persist();
        return { lastInsertRowid: Number(s.getInsertId()) };
      },
      get(...params) {
        if (params.length > 0) s.bind(params);
        if (s.step()) {
          const row = s.getAsObject();
          s.reset();
          return row;
        }
        s.reset();
        return undefined;
      },
      all(...params) {
        if (params.length > 0) s.bind(params);
        const rows = [];
        while (s.step()) {
          rows.push(s.getAsObject());
        }
        s.reset();
        return rows;
      }
    };
  }
};

compat.pragma('journal_mode = WAL');
compat.pragma('foreign_keys = ON');

export default compat;
