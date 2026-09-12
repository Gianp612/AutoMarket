const express = require("express");
const router = express.Router();
const {
  listarVehiculos,
  obtenerVehiculo,
  crearVehiculo,
  eliminarVehiculo,
} = require("../controllers/vehiculos.controller");

router.get("/", listarVehiculos);
router.get("/:id", obtenerVehiculo);
router.post("/", crearVehiculo);
router.delete("/:id", eliminarVehiculo);

module.exports = router;