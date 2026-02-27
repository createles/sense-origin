import * as db from "../db/queries.js";

//  -- COFFEE CATALOG PAGE --

// render coffee-list catalog page
export async function getCatalog(req, res) {
  try {
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
      coffees: coffees
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

// -- COFFEE-FORM PAGE -- 

// render coffee-form to add new coffee item
export async function getNewCoffeeForm(req, res) {
  try {
   const origins = await db.getAllOrigins();
   
   if (origins.length === 0) {
    return res.status(404).send("Could not fetch list of origins.");
   }

   res.render("coffee-form", {
    title: "Add New Coffee Item",
    origins: origins,
    coffee: {}
   });
  } catch (error) {
    console.error("Error loading new coffee form.", error);
    res.status(500).send("Internal Server Error");
  }
}

// POST new coffee item into database
export async function postNewCoffee(req, res) {
  try {
    const {
      name,
      location,
      description,
      price,
      stock,
      originId,
      //  for handling new origin creation
      newOriginName,
      newOriginRegion,
      newOriginDescription,
    } = req.body;

    // check that mandatory fields not missing before insertion
    if (!name || !price || !originId) {
      return res.status(400).send("Name, price, and origin are required.");
    }

    // temporarily set finalOriginId to originId as fallback
    let finalOriginId = originId;

    // check if new origin is being created
    if (originId === "new") {
      if (!newOriginName) {
        return res.status(400).send("New origin name field is required.");
      }
    // set finalOriginId to new id
      finalOriginId = await db.insertOrigin(newOriginName, newOriginRegion, newOriginDescription);
    }

    await db.insertCoffee(
      name,
      location,
      description,
      price,
      stock,
      finalOriginId,
    );

    res.redirect("/catalog");
  } catch (error) {
    console.error("Error adding new item into the database.", error);
    res.status(500).send("Internal Server Error");
  }
}

// Edit coffee item details
export async function getEditCoffeeForm(req, res) {
  try {
    const origins = await db.getAllOrigins();
  
    if (origins.length === 0) {
      return res.status(404).send("Could not fetch list of origins.");
    }

    const coffeeId = req.params.id;
    const coffee = await db.getCoffeeById(coffeeId);

    if (!coffee) {
      return res.status(404).send("Coffee not found.");
    }

    res.render("coffee-form", {
      title: "Edit Coffee Item",
      origins: origins,
      coffee: coffee
    });
  } catch (error) {
    console.error("Failure in fetching coffee details.", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update coffee item
export async function postEditCoffee(req, res) {
  try {
    const coffeeId = req.params.id;
    const {
      name,
      location,
      description,
      price,
      stock,
      originId,
      newOriginName,
      newOriginRegion,
      newOriginDescription,
    } = req.body;

    if (!name || !price || !originId) {
      return res.status(400).send("Name, price, and origin are required.");
    }

    let finalOriginId = originId;

    if (originId === "new") {
      if (!newOriginName) {
        return res.status(400).send("New origin name field is required.");
      }
      finalOriginId = await db.insertOrigin(newOriginName, newOriginRegion, newOriginDescription);
    }

    await db.updateCoffee(
      coffeeId,
      name,
      location,
      description,
      price,
      stock,
      finalOriginId,
    );

    res.redirect(`/coffee/${coffeeId}`);
  } catch (error) {
    console.error("Failure in updating coffee details", error);
    res.status(500).send("Internal Server Error");
  }
}