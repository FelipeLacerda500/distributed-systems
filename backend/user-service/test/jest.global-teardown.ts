const fs = require('node:fs');
const path = require('node:path');

module.exports = async function globalTeardown() {
  const dbFile = path.resolve(process.cwd(), 'prisma', 'test.db');
  if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
};
