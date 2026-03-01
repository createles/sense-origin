import { Router } from "express";
import { getCatalog, getEditCoffeeForm, getNewCoffeeForm, postEditCoffee, postNewCoffee } from "../controllers/coffeeController.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

// View coffee catalog
appRouter.get("/catalog", getCatalog);

// Create new coffee item routes
appRouter.get("/coffee-form", getNewCoffeeForm);
appRouter.post("/coffee-form", postNewCoffee);

// Edit coffee item routes
appRouter.get("/coffee/:id/edit", getEditCoffeeForm);
appRouter.post("/coffee/:id/edit", postEditCoffee);

export default appRouter;