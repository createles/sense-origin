import session from "express-session";
import "dotenv/config";
import express, { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import appRouter from "./routes/appRouter.js";

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

// session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // cookie expires after 1 hour
}))

// passes session status to all EJS templates
app.use((req, res, next) => {
  // create global "isAdmin" variable accross all EJS views
  res.locals.isAdmin = req.session.isAdmin || false; 
  next();
});

// test route
app.use("/", appRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
