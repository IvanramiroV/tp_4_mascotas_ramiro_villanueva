const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS y Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Recursos estáticos y urlencoded[cite: 3, 5]
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: false }));

// Variable en memoria para las mascotas (cargada desde el JSON)[cite: 1, 2]
let mascotas = [];
const ESTADOS_PERMITIDOS = ["En adopción", "Reservada", "Adoptada"];

// Lectura de datos iniciales antes de iniciar el servidor[cite: 3]
fs.readFile(path.join(__dirname, "..", "datos", "mascotas.json"), "utf8", (err, data) => {
  if (err) {
    console.error("Error al leer los datos iniciales:", err);
    process.exit(1);
  }
  
  try {
    mascotas = JSON.parse(data);
    
    // Contrato de Rutas Obligatorias[cite: 3]
    app.get("/", (req, res) => {
      res.render("mascotas/inicio", { titulo: "Inicio - Adopción de Mascotas" });
    });

    app.get("/mascotas", (req, res) => {
      res.render("mascotas/lista", { 
        titulo: "Catálogo de Mascotas", 
        mascotas 
      });
    });

    app.get("/mascotas/nueva", (req, res) => {
      res.render("mascotas/nueva", { 
        titulo: "Registrar Nueva Mascota", 
        error: null, 
        valores: {} 
      });
    });

    app.get("/mascotas/:id", (req, res) => {
      const idBuscado = Number(req.params.id);
      const mascota = mascotas.find(m => m.id === idBuscado);

      if (!mascota) {
        res.status(404);
        return res.render("mascotas/no-encontrado", { titulo: "Mascota No Encontrada" });
      }

      res.render("mascotas/detalle", { titulo: mascota.nombre, mascota });
    });

    app.post("/mascotas", (req, res) => {
      const { nombre, especie, edad, descripcion, estado } = req.body;
      const edadNumero = Number(edad);

      // Validación estricta de campos, edad y pertenencia a los estados permitidos[cite: 2, 4]
      if (
        !nombre || !nombre.trim() ||
        !especie || !especie.trim() ||
        !descripcion || !descripcion.trim() ||
        !estado || !ESTADOS_PERMITIDOS.includes(estado) ||
        isNaN(edadNumero) || edadNumero < 0
      ) {
        res.status(400);
        return res.render("mascotas/nueva", {
          titulo: "Registrar Nueva Mascota",
          error: "Todos los campos son obligatorios, la edad debe ser un número válido (0 o mayor) y el estado debe ser válido.",
          valores: req.body
        });
      }

      // Creación del nuevo ID en memoria
      const nuevoId = mascotas.length > 0 ? mascotas[mascotas.length - 1].id + 1 : 1;

      const nuevaMascota = {
        id: nuevoId,
        nombre: nombre.trim(),
        especie: especie.trim(),
        edad: edadNumero,
        descripcion: descripcion.trim(),
        estado,
        imagen: "/img/mascota.svg"
      };

      mascotas.push(nuevaMascota);
      res.redirect("/mascotas");
    });

    // Manejo global 404 para rutas no contempladas[cite: 3]
    app.use((req, res) => {
      res.status(404);
      res.render("mascotas/no-encontrado", { titulo: "Página No Encontrada" });
    });

    // El servidor arranca solo tras la lectura exitosa del JSON[cite: 3]
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (parseErr) {
    console.error("Error al parsear el archivo JSON:", parseErr);
    process.exit(1);
  }
});