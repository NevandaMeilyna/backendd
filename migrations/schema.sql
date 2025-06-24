CREATE TABLE bouquets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL
);

-- membuat folder migrasi untuk ke db