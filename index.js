require('dotenv').config();
const express = require('express');
const path = require('path');
const { getAllPets, createPet, updatePet, getPetById } = require('./utils/hubspot');

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

/* ==============================
   TODO: ROUTE 2 - Add New Pet
   ============================== */
app.post('/add-cobj', async (req, res) => {
  const { pet_name, pet_type, pet_bio } = req.body;
  try {
    await createPet({ pet_name, pet_type, pet_bio });
    res.redirect('/');
  } catch (err) {
    console.error('Error adding pet:', err);
    res.status(500).send('Error adding pet');
  }
});


/* ==============================
   TODO: ROUTE 3 - Update Page - Edit Pet 
   ============================== */
app.get('/edit-cobj/:id', async (req, res) => {
  const petId = req.params.id;

  try {
    const pet = await getPetById(petId);
    if (!pet) return res.status(404).send('Pet not found');

    res.render('edit', { petId, pet });
  } catch (err) {
    console.error('Error loading pet for edit:', err);
    res.status(500).send('Error loading edit form');
  }
});

/* ==============================
   Update Pet Details
   ============================== */
app.post('/update-cobj', async (req, res) => {
  const { id, pet_name, pet_type, pet_bio } = req.body;

  try {
    await updatePet(id, { pet_name, pet_type, pet_bio });
    res.redirect('/');
  } catch (err) {
    console.error('Error updating pet:', err.response?.data || err.message);
    res.status(500).send('Error updating pet');
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));