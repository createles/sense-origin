import * as db from "../db/queries.js";
import { body, validationResult } from "express-validator"; 

// get admin login page
export function getLogin(req, res) {
  const errorMsg = req.query.error;
  res.render("login", {
    title: "Admin Login",
    errorMsg
  });
}

// handle login via post
export function postLogin(req, res) {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect("/manage");
  } else {
    const msg = encodeURIComponent("Incorrect admin password.");
    res.redirect(`/login?error=${msg}`);
  }
}

// handle logout via post
export function postLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/")
  })
}

export function requireAdmin(req, res, next) {
  // if user has admin permissions, proceed to next function
  if (req.session && req.session.isAdmin) {
    next(); 
  } else {
    // If not, go back to login page
    res.redirect("/login"); 
  }
}

// Validation rules
export const validateOrigin = [
  // remove white spaces and check to ensure value exists
  // .escape() converts HTML characters to safe equivalents (eg. < > )
  body("name").trim().notEmpty().withMessage("Origin name is required.").escape(),
  body("region").trim().notEmpty().withMessage("Region is required.").escape(),
  body("desc").trim().escape() // Description is optional, so we just sanitize it!
];

export const validateCoffee = [
  body("name").trim().notEmpty().withMessage("Name is required.").escape(),
  body("originId").notEmpty().withMessage("Origin is required.").isInt(),
  body("location").trim().escape(),
  body("desc").trim().escape(),
  body("price").notEmpty().withMessage("Price is required.").isFloat().withMessage("Price must be a positive number."),
  body("stock").optional({checkFalsy: true}).isInt({ min: 0 }).withMessage("Stock must be a positive number.")
];



//  -- COFFEE CATALOG PAGE --

// render coffee-list catalog page
export async function getCatalog(req, res) {
  try {
    
    // check for operation status messages
    const errorMsg = req.query.error;
    const successMsg = req.query.success;

    // check for any filters applied to GET form
    const filterId = req.query.origin;

    let coffees;
    
    // filtered by specific origin
    if (filterId && filterId !== "all") {
      coffees = await db.getCoffeesByOrigin(filterId);
    
    // or get all coffees 
    } else {
      coffees = await db.getAllCoffees();
    }

    // used to populate filters sidebar
    const origins = await db.getAllOrigins();

    res.render("coffee-list", {
      origins: origins, 
      coffees: coffees,
      error: errorMsg,
      success: successMsg
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    res.status(500).send("Internal Server Error");
  }
}

// render coffee-item page
export async function getCoffeeDetails(req, res) {
  try {
    const coffeeId = req.params.id;
    const coffee = await db.getCoffeeById(coffeeId);

    if (!coffee) {
      return res.status(404).send("Coffee not found");
    }

    res.render("coffee-item", {
      title: `${coffee.origin_name} - ${coffee.name}`,
      coffee: coffee
    });
  } catch (error) {
    console.error("Error fetching coffee details.", error);
    res.status(500).send("Internal Server Error");
  }
}

// -- ADMIN DASHBOARD PAGE -- 

// Load management dashboard
export async function getManagementDashboard(req, res) {
  try {
    const origins = await db.getAllOrigins();
    const coffees = await db.getAllCoffees();

    const successMsg = req.query.success;
    const errorMsg = req.query.error;

    res.render("manage", {
      title: "Inventory Management Dashboard",
      origins: origins, 
      coffees: coffees,
      successMsg,
      errorMsg 
    });
  } catch (error) {
    console.error("Access to admin dashboard aborted.", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function postNewOrigin(req, res) {
  try {
    const errors = validationResult(req);

    // if mandatory values missing, redirect back with error msg
    if (!errors.isEmpty()) {
      const firstErrorMsg = errors.array()[0].msg;
      const msg = encodeURIComponent(`[ORIGINS]: ${firstErrorMsg}`);
      return res.redirect(`/manage?error=${msg}`)
    }

    const {
      name,
      region,
      desc
    } = req.body;

    await db.insertOrigin(name, region, desc);

    const msg = encodeURIComponent(`[ORIGINS]: "${name}" added to origin categories.`);
    res.redirect(`/manage?success=${msg}`)

  } catch (error) {
    console.error("Failed to add origin category.", error);
    const msg = encodeURIComponent("Failed to create origin category. Please try again.");
    res.redirect(`/manage?error=${msg}`)
  }
}

export async function postEditOrigin(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstErrorMsg = errors.array()[0].msg;
      const msg = encodeURIComponent(`[ORIGINS]: ${firstErrorMsg}`);
      return res.redirect(`/manage?error=${msg}`)
    }

    const id = req.params.id;
    const {
      name,
      region,
      desc
    } = req.body;

    await db.updateOrigin(
      id,
      name,
      region,
      desc
    );

    const msg = encodeURIComponent(`[ORIGINS]: Successfully updated details for "${name}."`);
    res.redirect(`/manage?success=${msg}`)
    
  } catch (error) {
    console.error("Failed to update origin details.", error);
    const msg = encodeURIComponent("Failed to update origin details. Please try again.");
    res.redirect(`/manage?error=${msg}`)
  }
}

// Delete coffee origin
export async function postDeleteOrigin(req, res) {
  try {
    const originId = req.params.id;
    const coffees = await db.getCoffeesByOrigin(originId);
  
    if (coffees.length > 0) {
      // ensures URL doesnt break due to spaces and special characters
      const msg = encodeURIComponent("Cannot delete an origin with coffees still attached.");
      return res.redirect(`/catalog?error=${msg}`);
    }
    
    const origin = await db.getOriginById(originId);
    const originName = origin.name;
    await db.deleteOrigin(originId);

    const msg = encodeURIComponent(`[ORIGINS]: Successfully removed ${originName} from origin categories.`);
    res.redirect(`/manage?success=${msg}`);

  } catch (error) {
    console.error("Failure to delete origin.", error);
    const msg = encodeURIComponent("[ORIGINS]: Failed to delete origin category. Please try again.")
    res.redirect(`/manage?error=${msg}`);
  }
}

// POST new coffee item into database
export async function postNewCoffee(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstErrorMsg = errors.array()[0].msg;
      const msg = encodeURIComponent(`[COFFEES]: ${firstErrorMsg}`);
      return res.redirect(`/manage?error=${msg}`)
    }

    const {
      name,
      location,
      desc,
      price,
      stock,
      originId
    } = req.body;

    await db.insertCoffee(
      name,
      location,
      desc,
      price,
      stock,
      originId,
    );

    const msg = encodeURIComponent(`[COFFEES]: Successfully added "${name}" to inventory.`)
    res.redirect(`/manage?success=${msg}`);
  
  } catch (error) {
    console.error("Error adding new item to inventory.", error);
    const msg = encodeURIComponent("Failed to add new coffee item. Please try again.")
    res.redirect(`/manage?error=${msg}`);
  }
}

// Update coffee item
export async function postEditCoffee(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstErrorMsg = errors.array()[0].msg;
      const msg = encodeURIComponent(`[COFFEES]: ${firstErrorMsg}`);
      return res.redirect(`/manage?error=${msg}`)
    }

    const coffeeId = req.params.id;
    const {
      name,
      location,
      desc,
      price,
      stock,
      originId,
    } = req.body;

    await db.updateCoffee(
      coffeeId,
      name,
      location,
      desc,
      price,
      stock,
      originId,
    );

    const msg = encodeURIComponent(`[COFFEES]: Successfully updated details for "${name}."`)
    res.redirect(`/manage?success=${msg}`);
  } catch (error) {
    console.error("Failure in updating coffee details", error);
    const msg = encodeURIComponent(`[COFFEES]: Failed to update coffee details. Please try again.`)
    return res.redirect(`/manage?error=${msg}`);
  }
}

// Delete coffee item
export async function postDeleteCoffee(req, res) {
  try {
  const coffeeId = req.params.id;

  const coffee = await db.getCoffeeById(coffeeId);
  const name = coffee.name;

  await db.deleteCoffee(coffeeId);

  const msg = encodeURIComponent(`[COFFEES]: Successfully deleted "${name}" from inventory.`)
  res.redirect(`/manage?success=${msg}`);

  } catch (error) {
    console.error("Failure to delete coffee item", error);
    const msg = encodeURIComponent("[COFFEES]: Failed to delete item from inventory. Please try again.")
    res.redirect(`/manage?error=${msg}`);
  }
}