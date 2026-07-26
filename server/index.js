require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const connectDB = require('./db');
const Quake = require('./models/Quake');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/api/quakes', async (req, res) => {
  try {
    const quakes = await Quake.find().sort({ time: -1 }).limit(500);
    res.json(quakes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read from database' });
  }
});

app.post('/api/quakes/sync', async (req, res) => {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );
    const data = await response.json();

    const ops = data.features.map((f) => ({
      updateOne: {
        filter: { usgsId: f.id },
        update: {
          usgsId: f.id,
          place: f.properties.place,
          magnitude: f.properties.mag,
          time: new Date(f.properties.time),
          lon: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
          depth: f.geometry.coordinates[2],
          url: f.properties.url,
        },
        upsert: true,
      },
    }));

    const result = await Quake.bulkWrite(ops);
    res.json({ synced: ops.length, result: result.upsertedCount + result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync from USGS' });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
