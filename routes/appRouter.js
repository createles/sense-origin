import { Router } from "express";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.send("Welcome to Sense Coffee.")
});

appRouter.get("/origin/:categoryName", (req, res) => {
  // temp basic use of route parameters and res.send
  const categoryName = req.params.categoryName;

  res.send(`Viewing ${categoryName} Coffees:`);
});

export default appRouter;