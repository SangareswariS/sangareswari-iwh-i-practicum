require('dotenv').config();
const axios = require('axios');

/* ==============================
   Configuration
   ============================== */
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const BASE_URL = 'https://api.hubapi.com';
const HUBSPOT_CUSTOM_OBJECT_TYPE = 'pets';

const headers = {
  Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

/* ==============================
    Create Custom Object Schema
   ============================== */
async function createCustomObjectSchema() {
  try {
    const response = await axios.post(
      `${BASE_URL}/crm/v3/schemas`,
      {
        name: 'pets',
        labels: {
          singular: 'Pet',
          plural: 'Pets',
        },
        primaryDisplayProperty: 'pet_name',
        requiredProperties: ['pet_name'],
        properties: [
          {
            name: 'pet_name',
            label: 'Name',
            type: 'string',
            fieldType: 'text',
          },
          {
            name: 'pet_type',
            label: 'Type',
            type: 'string',
            fieldType: 'text',
          },
          {
            name: 'pet_bio',
            label: 'Bio',
            type: 'string',
            fieldType: 'textarea',
          },
        ],
        associatedObjects: ['contacts'],
      },
      { headers }
    );

    console.log('Custom Object Schema Created Successfully!');
    console.log('Schema ID:', response.data.objectTypeId);
    return response.data.objectTypeId;

  } catch (error) {
    if (error.response?.status === 409) {
      console.log('Custom object already exists. Skipping creation.');
    } else {
      console.error(
        'Error creating custom object schema:',
        error.response?.data || error.message
      );
    }
  }
}

/* ==============================
   Create Custom Object Record
   ============================== */
async function createCustomObjectRecord(pet) {
  try {
    console.log('Creating record for pet:', pet);

    const response = await axios.post(
      `${BASE_URL}/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT_TYPE}`,
      { properties: pet },
      { headers }
    );

    console.log(`Record Created: ${pet.pet_name}`);
    return response.data;

  } catch (error) {
    console.error(
      `Error creating record (${pet.pet_name}):`,
      error.response?.data || error.message
    );
  }
}

/* ==============================
   Main Runner
   ============================== */
(async function run() {
  await createCustomObjectSchema();

  // const samplePets = [
  //   { pet_name: 'Bella', pet_type: 'Dog', pet_bio: 'Playful and friendly' },
  //   { pet_name: 'Milo', pet_type: 'Cat', pet_bio: 'Loves sleeping in the sun' },
  //   { pet_name: 'Rocky', pet_type: 'Rabbit', pet_bio: 'Curious and energetic' },
  // ];

  // for (const pet of samplePets) {
  //   await createCustomObjectRecord(pet);
  // }

  // console.log('All sample records added successfully!');
})();
