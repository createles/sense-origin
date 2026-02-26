import { Router } from "express";
import { getCatalog } from "../controllers/coffeeController.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

appRouter.get("/catalog", getCatalog);

appRouter.get("/origin/:categoryName", (req, res) => {
  // temp basic use of route parameters and res.send
  const categoryName = req.params.categoryName;

  res.send(`Viewing ${categoryName} Coffees:`);
});

export default appRouter;