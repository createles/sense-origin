import "dotenv/config";
import express, { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

// ES6 dirname reconstruction
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// parse URL encoded bodies from form data
app.use(express.urlencoded({ extended: true }));

// serve static assests (stylesheet, ico)
app.use(express.static(path.join(__dirname, "public")));

// test route
app.get("/", (req, res) => {
  res.send("Welcome to Sense Coffee.")
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
