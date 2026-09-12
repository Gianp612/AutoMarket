const express = require("express");
const router = express.Router();
const Consulta = require("../models/Consulta");

router.get("/", async (req, res) => {
  try {
    const consultas = await Consulta.find().populate("id_vehiculo");
    res.json(consultas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevaConsulta = await Consulta.create(req.body);
    res.status(201).json(nuevaConsulta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;