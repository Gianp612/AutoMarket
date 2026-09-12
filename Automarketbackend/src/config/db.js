const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Falta la variable de entorno MONGO_URI");
    }
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB Atlas correctamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;