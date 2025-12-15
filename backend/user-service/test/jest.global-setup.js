const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async function globalSetup() {
  const dbFile = path.resolve(process.cwd(), "prisma", "test.db");

  if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);

  execSync("npx prisma migrate deploy --schema=./prisma/schema.prisma", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: "file:./prisma/test.db",
      NODE_ENV: "test",
    },
  });

  execSync("npx prisma generate --schema=./prisma/schema.prisma", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: "file:./prisma/test.db",
      NODE_ENV: "test",
    },
  });
};
