const mongoose = require("mongoose");

// El formulario de contacto de AutoMarket no requiere login,
// así que guardamos los datos de contacto directamente en la consulta.
const consultaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String },
  id_vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo", required: false },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Consulta", consultaSchema);