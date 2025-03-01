const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const port = process.env.PORT || 3000;

app.use(cors());

// Root Route für Keep-Alive
app.get('/', (req, res) => {
  res.send('OK');
});

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

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);

  // Keep-Alive-Mechanismus
  const keepAlive = () => {
    const url = `http://localhost:${port}/`;
    fetch(url)
      .then(res => console.log(`Keep-Alive request sent, status: ${res.status}`))
      .catch(err => console.error('Error sending keep-alive:', err));
  };

  // Sofortige Ausführung und alle 5 Minuten wiederholen
  keepAlive();
  setInterval(keepAlive, 5 * 60 * 1000);
});
