import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Middleware CORS agar bisa diakses dari frontend (Vue.js)
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Endpoint test
app.get("/api", (c) => c.text("API Bouquet aktif"));

// GET /api/bouquets → Ambil semua bouquet
app.get("/api/bouquets", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM bouquets").all();
    return c.json(results);
  } catch (err) {
    return c.text("Gagal mengambil data bouquet: " + err.message, 500);
  }
});

// POST /api/bouquets → Tambah bouquet baru
app.post("/api/bouquets", async (c) => {
  try {
    const { name, description, price } = await c.req.json();
    const stmt = c.env.DB.prepare(
      "INSERT INTO bouquets (name, description, price) VALUES (?, ?, ?)"
    );
    const result = await stmt.bind(name, description, price).run();
    return c.json({ message: "Bouquet berhasil ditambahkan", result }, 201);
  } catch (err) {
    return c.text("Gagal menambahkan bouquet: " + err.message, 500);
  }
});

// PUT /api/bouquets/:id → Update data bouquet
app.put("/api/bouquets/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { name, description, price } = await c.req.json();
    const stmt = c.env.DB.prepare(
      "UPDATE bouquets SET name = ?, description = ?, price = ? WHERE id = ?"
    );
    const result = await stmt.bind(name, description, price, id).run();
    return c.json({ message: "Bouquet berhasil diupdate", result });
  } catch (err) {
    return c.text("Gagal mengupdate bouquet: " + err.message, 500);
  }
});

// DELETE /api/bouquets/:id → Hapus bouquet berdasarkan ID
app.delete("/api/bouquets/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const stmt = c.env.DB.prepare("DELETE FROM bouquets WHERE id = ?");
    const result = await stmt.bind(id).run();
    return c.json({ message: "Bouquet berhasil dihapus", result });
  } catch (err) {
    return c.text("Gagal menghapus bouquet: " + err.message, 500);
  }
});

// Handler static file (opsional)
app.get("*", (c) => c.env.ASSETS?.fetch(c.req.raw) ?? c.text("Not Found", 404));

export default app;
