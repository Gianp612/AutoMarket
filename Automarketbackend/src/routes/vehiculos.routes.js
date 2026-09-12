const express = require("express");
const router = express.Router();
const {
  listarVehiculos,
  obtenerVehiculo,
  crearVehiculo,
} = require("../controllers/vehiculos.controller");

router.get("/", listarVehiculos);
router.get("/:id", obtenerVehiculo);
router.post("/", crearVehiculo);

module.exports = router;