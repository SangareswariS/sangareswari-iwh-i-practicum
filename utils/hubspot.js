const axios = require('axios');

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const BASE_URL = 'https://api.hubapi.com';
const HUBSPOT_CUSTOM_OBJECT_TYPE = 'p244342521_pets';

const headers = {
  Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

// Fetch all pets
async function getAllPets() {
  try {
    const response = await axios.get(
      `${BASE_URL}/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT_TYPE}`,
      {
        headers,
        params: {
          properties: 'pet_name,pet_type,pet_bio,lastmodifieddate',
          limit: 10,
          after: 0,
          sorts: '-createdAt' // Sorts by createdate in descending order
        },
      }
    );

    const pets = response.data.results;

    if (!pets || pets.length === 0) {
      console.log('No records found in HubSpot.');
      return [];
    }

    return pets.map((pet) => ({
      id: pet.id,
      name: pet.properties.pet_name || 'Unnamed',
      type: pet.properties.pet_type || 'Unknown',
      bio: pet.properties.pet_bio || 'No bio available',
    }));
  } catch (error) {
    console.error('Error fetching pets:', error.response?.data || error.message);
    return [];
  }
}

// Create a new pet record
async function createPet(pet) {
  try {
    await axios.post(
      `${BASE_URL}/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT_TYPE}`,
      { properties: pet },
      { headers }
    );
    console.log('Pet created successfully');
  } catch (error) {
    console.error('Error creating pet:', error.response?.data || error.message);
    throw error;
  }
}


// Fetch a single pet by ID
async function getPetById(id) {
  try {
    const res = await axios.get(
      `${BASE_URL}/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT_TYPE}/${id}`,
      {
        headers,
        params: {
          properties: 'pet_name,pet_type,pet_bio',
        },
      }
    );
    return res.data.properties;
  } catch (error) {
    console.error('Error fetching pet by ID:', error.response?.data || error.message);
    throw error;
  }
}

// Update an existing pet record
async function updatePet(id, pet) {
  try {
    await axios.patch(
      `${BASE_URL}/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT_TYPE}/${id}`,
      { properties: pet },
      { headers }
    );
    console.log(`Pet (${id}) updated successfully`);
  } catch (error) {
    console.error('Error updating pet:', error.response?.data || error.message);
    throw error;
  }
}


module.exports = {
  getAllPets ,
  createPet,
  getPetById,
  updatePet,
};
