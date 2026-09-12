require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const vehiculosRoutes = require("./src/routes/vehiculos.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const consultasRoutes = require("./src/routes/consultas.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de salud, útil para verificar que el servidor y Render están bien
app.get("/", (req, res) => {
  res.json({ ok: true, mensaje: "API de AutoMarket funcionando" });
});

app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/consultas", consultasRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor AutoMarket escuchando en el puerto ${PORT}`);
  });
});