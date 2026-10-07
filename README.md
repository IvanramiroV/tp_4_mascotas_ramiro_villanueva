# Trabajo Práctico 04 - Aplicación Web con EJS (Mascotas en Adopción)

## Descripción[cite: 6]
Aplicación web desarrollada con Node.js, Express y EJS para la consulta de mascotas en adopción y el registro temporal de nuevas altas mediante formularios con validación.

## Instalación[cite: 6]
Ejecutar el siguiente comando en la raíz del proyecto para instalar las dependencias:
\`\`\`bash
npm install
\`\`\`

## Ejecución[cite: 6]
Para iniciar el servidor local en producción:
\`\`\`bash
npm start
\`\`\`

## Páginas y rutas[cite: 6]
- `GET /`: Página principal de bienvenida.
- `GET /mascotas`: Catálogo general en forma de tarjetas.
- `GET /mascotas/nueva`: Formulario de alta (declarada antes de la ruta dinámica por ID)[cite: 3].
- `GET /mascotas/:id`: Vista de detalle o renderizado de 404 si el identificador no existe[cite: 4].
- `POST /mascotas`: Procesamiento del formulario, validación de datos y estados permitidos, alta temporal en memoria y redirección a `/mascotas`[cite: 4].

## Estructura de vistas[cite: 6]
- **Layout**: Plantilla base contenedora (`views/layouts/main.ejs`)[cite: 4].
- **Vistas**: Contenidos particulares (`inicio.ejs`, `lista.ejs`, `detalle.ejs`, `nueva.ejs`, `no-encontrado.ejs`)[cite: 3, 4].
- **Parciales**: Fragmentos reutilizables de encabezado y pie de página[cite: 4].

## Recursos estáticos[cite: 5, 6]
Servidos mediante Express a través de la carpeta `public`:
- Hoja de estilos: `/css/estilos.css`[cite: 5]
- Imagen SVG local: `/img/mascota.svg`[cite: 2, 5]
- Script en consola: `/js/app.js`[cite: 5]

## Formulario[cite: 6]
Contiene controles etiquetados. Ante datos incorrectos o incompletos, responde con estado `400`, emite una alerta accesible con `role="alert"` y conserva los valores ingresados[cite: 4].

## Persistencia de los datos[cite: 6]
Los datos iniciales se cargan de forma asíncrona desde `datos/mascotas.json`[cite: 3]. Las nuevas incorporaciones se guardan **únicamente en memoria** (`Array.push`), por lo que al reiniciar la aplicación se restablece al estado original del archivo[cite: 4, 6].

### Conceptos clave explicados:[cite: 6]
- **Diferencia entre layout, vista y parcial**: El layout envuelve la estructura común; las vistas representan cada pantalla específica; y los parciales estructuran partes repetitivas como menús o pies.
- **Datos enviados mediante res.render**: Permite transferir variables dinámicas desde el servidor hacia las plantillas EJS.
- **express.static**: Middleware para servir archivos estáticos de forma directa y segura.
- **express.urlencoded**: Middleware que interpreta los datos enviados por formularios POST estructurándolos en `req.body`.
- **Recorrido POST, redirección y GET**: Patrón donde el servidor procesa el formulario mediante POST, actualiza la memoria y redirige mediante HTTP 302 a `/mascotas` con un GET.
- **Motivo de pérdida de datos al reiniciar**: Al no utilizar bases de datos ni escritura en archivos, la persistencia reside enteramente en la memoria RAM del proceso activo de Node.js.