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

function freeStmt(s) {
  if (s && s.Qa) try { s.free(); } catch (_) {}
}

function useOne(name, sql, params, mode) {
  const s = sqlJsDb.prepare(sql);
  try {
    if (params.length > 0) s.bind(params);
    if (mode === 'run') {
      s.step();
    } else if (mode === 'get') {
      if (s.step()) {
        const row = s.getAsObject();
        return row;
      }
      return undefined;
    } else {
      const rows = [];
      while (s.step()) rows.push(s.getAsObject());
      return rows;
    }
  } finally {
    freeStmt(s);
  }
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
    return {
      run(...params) {
        useOne('run', sql, params, 'run');
        const rid = sqlJsDb.exec("SELECT last_insert_rowid()");
        persist();
        return { lastInsertRowid: Number(rid?.[0]?.values?.[0]?.[0] ?? 0) };
      },
      get(...params) {
        return useOne('get', sql, params, 'get');
      },
      all(...params) {
        return useOne('all', sql, params, 'all');
      }
    };
  }
};

compat.pragma('journal_mode = WAL');
compat.pragma('foreign_keys = ON');

export default compat;
