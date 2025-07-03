const Database = require('better-sqlite3');
const db = new Database('zfcocteles.db');

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS cocteles (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    data TEXT
  )
`
).run();

module.exports = {
  guardarCoctel: (coctel) => {
    const stmt = db.prepare('INSERT INTO cocteles (nombre, data) VALUES (?, ?)');
    stmt.run(coctel.nombre, JSON.stringify(coctel));
  },
};
