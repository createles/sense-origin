import * as db from "../db/queries.js";

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

    res.render('coffee-item', {
      title: `${coffee.origin_name} - ${coffee.name}`,
      coffee: coffee
    });
  } catch (error) {
    console.error("Error fetching coffee details.", error);
    res.status(500).send("Internal Server Error");
  }
}