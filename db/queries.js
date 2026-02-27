import pool from './pool.js';

// READ operations
export async function getAllOrigins() {
  const { rows } = await pool.query('SELECT * FROM origins ORDER BY name ASC');
  return rows;
}

export async function getAllCoffees() {
  const query = `
    SELECT coffees.*, origins.name AS origin_name
    FROM coffees
    JOIN origins ON coffees.origin_id = origins.id
    ORDER BY coffees.name ASC
  `;

  const { rows } = await pool.query(query);
  return rows;
}

export async function getCoffeesByOrigin(originId) {
  const query = `
    SELECT coffees.*, origins.name AS origin_name
    FROM coffees
    JOIN origins ON coffees.origin_id = origins.id
    WHERE origins.id = $1
    ORDER BY coffees.name ASC
  `;

  const { rows } = await pool.query(query, [originId]);
  return rows;
}

export async function getCoffeeById(id) {
  const query = `
    SELECT coffees.*, origins.name AS origin_name
    FROM coffees
    JOIN origins ON coffees.origin_id = origins.id
    WHERE coffees.id = $1`
  const { rows } = await pool.query(query, [id])
  // return ONLY a single row instead of an array
  // with only 1 element
  return rows[0]; 
}

export async function getOriginById(id) {
  const query = `SELECT * FROM origins WHERE id = $1`
  const { rows } = await pool.query(query, [id])
  return rows[0]; 
}

// CREATE operations
export async function insertOrigin(name, region, description) {
  const query = `
    INSERT INTO origins (name, region, description)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const { rows } = await pool.query(query, [name, region, description]);
  return rows[0].id;
}

export async function insertCoffee(name, location, description, price, stock, originId) {
  const query = `
    INSERT INTO coffees (name, location, description, price, stock, origin_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  await pool.query(query, [name, location, description, price, stock, originId])
}

// UPDATE operations
export async function updateOrigin(id, name, region, description) {
  const query = `
    UPDATE origins
    SET name = $1, region = $2, description = $3
    WHERE id = $4
  `;
  await pool.query(query, [name, region, description, id]);
}

export async function updateCoffee(id, name, location, description, price, stock, originId) {
  const query = `
    UPDATE coffees
    SET name = $1, location = $2, description = $3, price = $4, stock = $5, origin_id = $6
    WHERE id = $7
  `;
  await pool.query(query, [name, location, description, price, stock, originId, id]);
}

export async function deleteOrigin(id) {
  await pool.query(`DELETE FROM origins WHERE id = $1`, [id]);
}

export async function deleteCoffee(id) {
  await pool.query(`DELETE FROM cofees WHERE id = $1`, [id]);
}