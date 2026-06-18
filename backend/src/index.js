require('dotenv').config();
const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const { initDB } = require('./db');
const habitantsRouter = require('./routes/habitants');

const app = express();
const PORT = process.env.PORT || 5000;

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métriques custom
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const habitantsTotal = new client.Gauge({
  name: 'bandjoun_habitants_total',
  help: "Nombre total d'habitants inscrits",
  registers: [register],
});

// Middleware pour mesurer les requêtes
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.path;
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status: res.statusCode,
    });
    end({ method: req.method, route: route, status: res.statusCode });
  });
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/habitants', habitantsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Recensement Bandjoun API opérationnelle', version: '3.0.0' });
});

app.get('/api/quartiers', (req, res) => {
  res.json({
    success: true,
    data: [
            'Megome', 'Jumgo', 'Mboo I', 'Mboo II',
            'Fochie', 'Stella', 'Stese', 'Yom',
            'Kamgo', 'Pete', 'Chefferie',
      
    ],
  });
});

// Endpoint métriques Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

async function start() {
  try {
    await initDB();

    // Mettre à jour le gauge habitants toutes les 30 secondes
    const { pool } = require('./db');
    setInterval(async () => {
      try {
        const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM habitants');
        habitantsTotal.set(total);
      } catch (e) {}
    }, 30000);

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur au démarrage:', err);
    process.exit(1);
  }
}

start();