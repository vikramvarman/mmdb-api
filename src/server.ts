// this will load app which contains our main structure and logic
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

console.log("app initiated");

import app from "./app";

// use this line to get port from environment variable
const PORT = parseInt(process.env.PORT, 10) || 3000;
// const HOST = process.env.HOST;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
