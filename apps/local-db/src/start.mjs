import EmbeddedPostgres from "embedded-postgres"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, "..", ".pgdata")
const database = process.env.LOCAL_DB_NAME || "jsb_sons"
const user = process.env.LOCAL_DB_USER || "postgres"
const password = process.env.LOCAL_DB_PASSWORD || "postgres"
const port = Number(process.env.LOCAL_DB_PORT || 5432)

async function main() {
  const alreadyInitialised = fs.existsSync(path.join(dataDir, "PG_VERSION"))

  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user,
    password,
    port,
    persistent: true,
    initdbFlags: ["--encoding=UTF8", "--locale=C"],
  })

  if (!alreadyInitialised) {
    console.log("[local-db] initialising cluster in", dataDir)
    await pg.initialise()
  }

  await pg.start()
  console.log(`[local-db] postgres running on localhost:${port}`)

  if (!alreadyInitialised) {
    try {
      await pg.createDatabase(database)
      console.log(`[local-db] created database "${database}"`)
    } catch (error) {
      console.warn("[local-db] database creation skipped:", error.message)
    }
  } else {
    try {
      await pg.createDatabase(database)
      console.log(`[local-db] created database "${database}"`)
    } catch {
      console.log(`[local-db] database "${database}" already exists`)
    }
  }

  console.log(`[local-db] DATABASE_URL=postgres://${user}:${password}@localhost:${port}/${database}`)
  console.log("[local-db] press Ctrl+C to stop")

  const shutdown = async () => {
    console.log("\n[local-db] stopping postgres...")
    await pg.stop()
    process.exit(0)
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

main().catch((error) => {
  console.error("[local-db] failed to start:", error)
  process.exit(1)
})
