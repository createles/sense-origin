import { Router } from "express";
import { getCatalog, getCoffeeDetails, getEditCoffeeForm, getManagementDashboard, postDeleteCoffee, postDeleteOrigin, postEditCoffee, postEditOrigin, postNewCoffee, postNewOrigin } from "../controllers/coffeeController.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("index");
});

// View coffee catalog
appRouter.get("/catalog", getCatalog);

// View coffee item details page
appRouter.get("/coffee/:id", getCoffeeDetails);

// Create new origin
appRouter.post("/origin/new", postNewOrigin)

// Create new coffee item
appRouter.post("/coffee/new", postNewCoffee);

// Edit coffee item routes
appRouter.get("/coffee/:id/edit", getEditCoffeeForm);
appRouter.post("/coffee/:id/edit", postEditCoffee);

// Delete coffee item route
appRouter.post("/coffee/:id/delete", postDeleteCoffee);

// Delete origin route
appRouter.post("/origin/:id/delete", postDeleteOrigin);

// Admin Management Dashboard route
appRouter.get("/manage", getManagementDashboard);

// Edit origin route
appRouter.post("/origin/:id/edit", postEditOrigin);



export default appRouter;