const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  anio: { type: Number, required: true },
  precio: { type: Number, required: true },
  caracteristicas: { type: String },
  descripcion: { type: String },
  icono: { type: String },
  imagen: { type: String },
});

module.exports = mongoose.model("Vehiculo", vehiculoSchema);