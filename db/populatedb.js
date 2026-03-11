import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const SQL = `
DROP TABLE IF EXISTS coffees;
DROP TABLE IF EXISTS origins;

CREATE TABLE IF NOT EXISTS origins (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) UNIQUE NOT NULL,
  region VARCHAR ( 255 ) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS coffees (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) NOT NULL,
  location VARCHAR ( 255 ),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  origin_id INTEGER REFERENCES origins(id) ON DELETE RESTRICT 
);

INSERT INTO origins (name, region, description)
VALUES 
  ('Ethiopia', 'Africa', 'Renowned for bright acidity, floral aromas, and distinct fruity notes like blueberry and jasmine.'),
  ('Kenya', 'Africa', 'Famous for its bold, juicy acidity, complex berry flavors like blackcurrant, and a syrupy body.'),
  ('Colombia', 'Latin America', 'Celebrated for a beautifully balanced profile featuring caramel sweetness, milk chocolate, and mild citrus acidity.'),
  ('Indonesia', 'Asia & The Pacific', 'Known for heavy body, low acidity, and deep, earthy flavor profiles with notes of spice and cedar.'),
  ('Brazil', 'Latin America', 'Famous for its heavy body, low acidity, and prominent notes of chocolate, nuts, and caramel.'),
  ('Guatemala', 'Latin America', 'Offers a complex cup with rich chocolate flavors, bright apple-like acidity, and a smooth, full body.'),
  ('Rwanda', 'Africa', 'Features a silky, creamy body with sweet, floral aromas and notes of orange blossom and red berries.'),
  ('Papua New Guinea', 'Asia & The Pacific', 'Delivers a unique, savory sweetness with crisp acidity, tropical fruit notes, and a clean finish.');

INSERT INTO coffees (name, location, description, price, stock, origin_id)
VALUES 
  ('Yirgacheffe Aricha', 'Yirgacheffe', 'Washed process. Delicate notes of jasmine, lemon tea, and peach.', 18.50, 25, 1),
  ('Guji Uraga', 'Guji Zone', 'Natural process. Bursting with blueberry jam and honey sweetness.', 19.00, 15, 1),
  ('Nyeri Hill Estate AA', 'Nyeri', 'Washed process. Vibrant grapefruit acidity with deep blackberry undertones.', 21.00, 10, 2),
  ('Finca El Paraiso Thermal Shock', 'Cauca', 'Innovative processing yields intense strawberry, rose, and vanilla notes.', 28.00, 8, 3),
  ('Supremo Antioquia', 'Antioquia', 'Classic daily drinker. Smooth milk chocolate, toasted nuts, and caramel.', 15.00, 45, 3),
  ('Sumatra Mandheling', 'Sumatra', 'Wet-hulled process. Heavy syrupy body with dark chocolate, cedar, and earthy spice.', 16.50, 30, 4),
  ('Sulawesi Toraja', 'Toraja', 'Semi-washed. Herbal aromatics, molasses sweetness, and a buttery finish.', 17.00, 20, 4),
  ('Cerrado Mineiro Diamond', 'Minas Gerais', 'Natural process. Rich dark chocolate, hazelnut, and brown sugar.', 14.50, 50, 5),
  ('Antigua San Sebastian', 'Antigua', 'Washed process. Notes of baking chocolate, red apple, and toasted almond.', 17.50, 22, 6),
  ('Huehuetenango SHB', 'Huehuetenango', 'Washed process. Bright citrus, milk chocolate, and a lingering honey finish.', 18.00, 18, 6),
  ('Kigeyo Washing Station', 'Rutsiro', 'Washed process. Juicy mandarin orange, black tea, and floral honey.', 20.00, 14, 7),
  ('Kuta Valley Peaberry', 'Western Highlands', 'Washed process. Crisp green apple acidity with mango and savory cocoa notes.', 19.50, 12, 8);
`;

async function main() {
  console.log("Seeding database...");

  // Use DATABASE_URL whenever possible
  const clientConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : { // fallback to hardcoded variables
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      };

  const client = new Client(clientConfig);

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Completed seeding process successfully.");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await client.end();
  }
}

main();