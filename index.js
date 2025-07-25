require('dotenv').config();    
console.log('Loaded HUBSPOT_TOKEN:', process.env.HUBSPOT_TOKEN ? '✅ yes' : '❌ no');           // ← add this at the very top
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ← remove PRIVATE_APP_ACCESS constant; use env instead
// const PRIVATE_APP_ACCESS = '';

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const OBJECT_ID    = '2-47828840';  // e.g. "2-1234567"

app.get('/', async (req, res) => {
    console.log('👉 GET / handler running');   // ← add this line
    try {
      // … your existing axios call and res.render …
    } catch (err) {
      console.error('Homepage error:', err.response?.data || err);
      res.status(500).send('Error fetching records');
    }
  });

// ─── ROUTE 1 ───
// GET “/” → fetch all custom‑object records & render homepage.pug
app.get('/', async (req, res) => {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;
    const params = {
      limit: 100,
      properties: 'name,game_title,power_level'
    };
    const headers = { Authorization: `Bearer ${HUBSPOT_TOKEN}` };
    const apiRes = await axios.get(url, { params, headers });
    const records = apiRes.data.results;
    res.render('homepage', { title: 'Homepage | Custom Objects', records });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error fetching records');
  }
});

// ─── ROUTE 2 ───
// GET “/update-cobj” → render the form in updates.pug
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ─── ROUTE 3 ───
// POST “/update-cobj” → create a new custom‑object record then redirect back
app.post('/update-cobj', async (req, res) => {
  const { name, game_title, power_level } = req.body;
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;
    const headers = {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    const body = {
      properties: { name, game_title, power_level }
    };
    await axios.post(url, body, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error creating record');
  }
});



/*  
  * Leave the sample code commented out or delete it entirely once you
  * confirm your new routes work correctly.
*/

app.listen(process.env.PORT || 3000, () =>
  console.log('Listening on http://localhost:3000')
);
