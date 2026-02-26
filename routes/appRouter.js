import { Router } from "express";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

appRouter.get("/catalog", (req, res) => {
  res.render("coffee-list", { coffees: [] });
})

appRouter.get("/origin/:categoryName", (req, res) => {
  // temp basic use of route parameters and res.send
  const categoryName = req.params.categoryName;

  res.send(`Viewing ${categoryName} Coffees:`);
});

export default appRouter;