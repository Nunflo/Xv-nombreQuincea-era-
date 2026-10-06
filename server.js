const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Servir los archivos estáticos (tu HTML, música, etc.) desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// CONEXIÓN A FIREBASE
// Asegúrate de que este nombre sea EXACTAMENTE el de tu archivo .json
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// RUTA PARA RECIBIR EL FORMULARIO
app.post('/api/invitados', async (req, res) => {
  try {
    const { nombre, asistencia, adicionales } = req.body;
    
    await db.collection('invitados').add({
      nombre: nombre,
      asistencia: asistencia,
      adicionales: adicionales || 0,
      estado: 'pendiente',
      fechaRegistro: new Date()
    });

    res.status(200).json({ mensaje: "¡Registro exitoso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
});

// ENCENDER EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor listo en http://localhost:${PORT}!`);
});

module.exports = app;