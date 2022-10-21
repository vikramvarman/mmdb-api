// this will load app which contains our main structure and logic
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

console.log("app initiated");

import app from "./app";

// use this line to get port from environment variable
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
