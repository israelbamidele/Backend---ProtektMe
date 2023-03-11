const app = require("./app");
const db = require("./db/db");

const port = process.env.PORT || 5991;

async function startServer() {
  await db();
  app.listen(port, () => {
    console.log(`ForumApp connected on port ${port}`);
  });
}

startServer();
