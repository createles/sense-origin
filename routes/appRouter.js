import { Router } from "express";
import { getCatalog, getCoffeeDetails, getManagementDashboard, postDeleteCoffee, postDeleteOrigin, postEditCoffee, postEditOrigin, postNewCoffee, postNewOrigin, validateCoffee, validateOrigin } from "../controllers/coffeeController.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

// View coffee catalog
appRouter.get("/catalog", getCatalog);

// View coffee item details page
appRouter.get("/coffee/:id", getCoffeeDetails);

// Admin Management Dashboard route
appRouter.get("/manage", getManagementDashboard);

// ORIGIN ROUTES
appRouter.post("/origin/new", validateOrigin, postNewOrigin) // Create new origin
appRouter.post("/origin/:id/edit", validateOrigin, postEditOrigin); // Edit origin route
appRouter.post("/origin/:id/delete", postDeleteOrigin); // Delete origin route

// COFFEE ROUTES
appRouter.post("/coffee/new", validateCoffee, postNewCoffee); // Create new coffee item
appRouter.post("/coffee/:id/edit", validateCoffee, postEditCoffee); // Edit coffee item routes
appRouter.post("/coffee/:id/delete", postDeleteCoffee); // Delete coffee item route


export default appRouter;