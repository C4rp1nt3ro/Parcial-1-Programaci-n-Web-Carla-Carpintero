const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 5000;

app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: 'arbolitos',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 20000 },
  })
);

let data = [
  { id: 1, 
    tipo: 'Roble', 
    color: 'Marrón', 
    nombre: 'Árbol del patio' 
  },
  { id: 2, 
    tipo: 'Ciprés', 
    color: 'Verde', 
    nombre: 'Ciprés del jardín' 
  },
  { id: 3, 
    tipo: 'Jacaranda', 
    color: 'Morado', 
    nombre: 'Jacaranda de la calle' 
  },
];

// Rutas
app.get('/', (req, res) => {
  try {
    const titulo = 'Petición a la ruta raíz';
    const descripcion = 'Esta es una petición GET a la ruta raíz de la aplicación';
    res.cookie('peticion', { titulo, descripcion }, { expires: new Date('2024-02-22T23:59:59.000Z') });
  
    console.log(`Cookie: ${JSON.stringify(req.cookies.peticion)}`);
    res.send('<h1>Examen Carla y Rosario</h1><p>Visita la ruta /conteo para ver el contador de visitas</p>');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/conteo', (req, res) => {
  try {
    let visitas = req.session.visitas || 0;
    visitas++;
    req.session.visitas = visitas;
    res.send(`<h1>Has visitado esta ruta ${visitas} veces</h1>`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/arboles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const arbol = data.find(arbol => arbol.id === parseInt(id));

    if (arbol) {
      res.status(200).json(arbol);
    } else {
      res.status(404).send('Árbol no encontrado');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/arboles/nuevo', (req, res) => {
  try {
    const { id, tipo, color, nombre } = req.body;
  
    if (!id || !tipo || !color || !nombre) {
      res.status(400).send('Faltan datos en el body');
      return;
    }
  
    data.push({ id, tipo, color, nombre });
    res.status(201).json({ id, tipo, color, nombre });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/arboles', (req, res) => {
  try {
    const { id, color } = req.query;
  
    if (!id || !color) {
      res.status(302).redirect('/');
      return;
    }
  
    const dataFiltrada = data.filter(arbol => arbol.id === parseInt(id) && arbol.color === color);
    res.status(200).json(dataFiltrada);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Error interno del servidor');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto:${port}`);
});
