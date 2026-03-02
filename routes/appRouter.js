import { Router } from "express";
import { getCatalog, getCoffeeDetails, getEditCoffeeForm, getNewCoffeeForm, postDeleteCoffee, postDeleteOrigin, postEditCoffee, postNewCoffee } from "../controllers/coffeeController.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

// View coffee catalog
appRouter.get("/catalog", getCatalog);

// View coffee item details
appRouter.get("/coffee/:id", getCoffeeDetails);

// Create new coffee item routes
appRouter.get("/coffee-form", getNewCoffeeForm);
appRouter.post("/coffee-form", postNewCoffee);

// Edit coffee item routes
appRouter.get("/coffee/:id/edit", getEditCoffeeForm);
appRouter.post("/coffee/:id/edit", postEditCoffee);

// Delete coffee item route
appRouter.post("/coffee/:id/delete", postDeleteCoffee);

// Delete origin route
appRouter.post("/origin/:id/delete", postDeleteOrigin);

export default appRouter;