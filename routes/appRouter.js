import { Router } from "express";
import { getCatalog, getCoffeeDetails, getLogin, getManagementDashboard, postDeleteCoffee, postDeleteOrigin, postEditCoffee, postEditOrigin, postLogin, postLogout, postNewCoffee, postNewOrigin, requireAdmin, validateCoffee, validateOrigin } from "../controllers/coffeeController.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

// Login routes
appRouter.get("/login", getLogin);
appRouter.post("/login", postLogin);
appRouter.post("/logout", postLogout);

// Admin Management Dashboard route
appRouter.get("/manage", requireAdmin, getManagementDashboard);


// View coffee catalog
appRouter.get("/catalog", getCatalog);

// View coffee item details page
appRouter.get("/coffee/:id", getCoffeeDetails);

// ORIGIN ROUTES
appRouter.post("/origin/new", requireAdmin, validateOrigin, postNewOrigin) // Create new origin
appRouter.post("/origin/:id/edit", requireAdmin, validateOrigin, postEditOrigin); // Edit origin route
appRouter.post("/origin/:id/delete", requireAdmin, postDeleteOrigin); // Delete origin route

// COFFEE ROUTES
appRouter.post("/coffee/new", requireAdmin, validateCoffee, postNewCoffee); // Create new coffee item
appRouter.post("/coffee/:id/edit", requireAdmin, validateCoffee, postEditCoffee); // Edit coffee item routes
appRouter.post("/coffee/:id/delete", requireAdmin, postDeleteCoffee); // Delete coffee item route


export default appRouter;