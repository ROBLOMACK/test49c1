const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const port = process.env.PORT || 3000;

app.use(cors());

// Proxy Route für API-Anfragen
app.get('/proxy/*', async (req, res) => {
  const targetUrl = req.url.replace('/proxy/', '');
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direkte Weiterleitung für Bilder
app.get('/img/*', async (req, res) => {
  const targetUrl = `https://fireani.me${req.url}`;
  try {
    const response = await fetch(targetUrl);
    const buffer = await response.arrayBuffer();
    res.type(response.headers.get('content-type'));
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
