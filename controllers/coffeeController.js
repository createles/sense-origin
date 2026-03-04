import * as db from "../db/queries.js";

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
    const {
      name,
      region,
      desc
    } = req.body;

    // check mandatory fields
    if (!name|| !region) {
      return res.status(400).send("Name, and region are required.");
    }

    await db.insertOrigin(name, region, desc);

    const msg = encodeURIComponent(`${name} origin added to inventory.`);
    res.redirect(`/manage?success=${msg}`)

  } catch (error) {
    console.error("Failed to add origin category.", error);

    const msg = encodeURIComponent("Failed to create origin category. Please try again.");
    res.redirect(`/manage?error=${msg}`)
  }
}

export async function postEditOrigin(req, res) {
  try {
    const originId = req.params.id;
    const {
      modalOriginName,
      modalOriginRegion,
      modalOriginDesc
    } = req.body;

    if (!modalOriginName || !modalOriginRegion || !originId) {
      return res.status(400).send("Name and region fields are required.");
    }

    await db.updateOrigin(
      originId,
      modalOriginName,
      modalOriginRegion,
      modalOriginDesc
    );

    res.redirect("/manage");
  } catch (error) {
    console.error("Failed to update origin details.", error);
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
      originId
    } = req.body;

    // check mandatory fields
    if (!name || !price || !originId) {
      return res.status(400).send("Name, price, and origin are required.");
    }

    await db.insertCoffee(
      name,
      location,
      description,
      price,
      stock,
      originId,
    );

    const msg = encodeURIComponent(`${name} has been successfully added to inventory.`)
    res.redirect(`/manage?success=${msg}`);
  
  } catch (error) {
    console.error("Error adding new item to inventory.", error);

    const msg = encodeURIComponent("Failed to add new coffee item. Please try again.")
    res.redirect(`/manage?error=${msg}`);
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

// Delete coffee item
export async function postDeleteCoffee(req, res) {
  try {
  const coffeeId = req.params.id;

  await db.deleteCoffee(coffeeId);

  res.redirect('/catalog')
  } catch (error) {
    console.error("Failure to delete coffee item", error);
    res.status(500).send("Internal Server Error");
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

    const msg = encodeURIComponent(`${originName} origin category removed from inventory.`);
    res.redirect(`/catalog?success=${msg}`);

  } catch (error) {
    console.error("Failure to delete origin.", error);
    res.status(500).send("Internal Server Error");
  }
}