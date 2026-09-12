const Vehiculo = require("../models/Vehiculo");

async function listarVehiculos(req, res) {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerVehiculo(req, res) {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id);
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearVehiculo(req, res) {
  try {
    const nuevoVehiculo = await Vehiculo.create(req.body);
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarVehiculo(req, res) {
  try {
    const vehiculo = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });
    res.json({ ok: true, mensaje: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarVehiculos, obtenerVehiculo, crearVehiculo, eliminarVehiculo };