const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const mongoose = require("mongoose");
const expenses = require("./routes/expenses");
const users = require("./routes/users");
const auth = require("./routes/auth");
const friends = require("./routes/friends");
const repayments = require("./routes/repayments");
const notification_tokens = require("./routes/notification_tokens");
const admin = require("firebase-admin");

const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey not defined");
  process.exit(1);
}

if (!config.get("database")) {
  console.error("FATAL ERROR: database not defined");
  process.exit(1);
}

if (!config.get("MJ_APIKEY_PUBLIC")) {
  console.error("FATAL ERROR: MJ_APIKEY_PUBLIC not defined");
  process.exit(1);
}

if (!config.get("MJ_APIKEY_PRIVATE")) {
  console.error("FATAL ERROR: MJ_APIKEY_PRIVATE not defined");
  process.exit(1);
}

if (!config.get("GOOGLE_APPLICATION_CREDENTIALS")) {
  console.error("FATAL ERROR: GOOGLE_APPLICATION_CREDENTIALS not defined");
  process.exit(1);
}

if (!config.get("firebase_database")) {
  console.error("FATAL ERROR: firebase_database not defined");
  process.exit(1);
}

mongoose
  .connect(config.get("database"))
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log("Could not connect to mongodb...", err));

//Startups
const serviceAccount = JSON.parse(
  Buffer.from(config.get("GOOGLE_APPLICATION_CREDENTIALS"), "base64").toString(
    "ascii"
  )
);
const firebaseDatabaseUrl = config.get("firebase_database");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseDatabaseUrl,
});

console.log("Initialized Firebase SDK");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/expenses", expenses);
app.use("/api/friends", friends);
app.use("/api/repayments", repayments);
app.use("/api/repayments", repayments);
app.use("/api/notification_tokens", notification_tokens);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports.customAdmin = admin;
