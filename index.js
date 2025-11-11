require('dotenv').config();
const express = require('express');
const path = require('path');
const { getAllPets } = require('./utils/hubspot');

const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;


/* ==============================
   TODO: ROUTE 1 - Home Page — List All Pets
   ============================== */
app.get('/', async (req, res) => {
  try {
    const pets = await getAllPets();
    res.render('homepage', { pets });
  } catch (err) {
    console.error('Error fetching pets:', err);
    res.status(500).send('Error fetching pets');
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));