const API_KEY = 'cba20c60-835d-4884-a172-e340d58dfca1'
const axios = require('axios');

async function getAirport(iata_code) {
  const options = {
    method: 'GET',
    url: `https://airlabs.co/api/v9/airports?iata_code=${iata_code}&api_key=${API_KEY}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await axios(options);

  if (response.data.response.length === 0) {
      throw new Error(`El IATA_CODE '${iata_code}' ingresado es incorrecto`)
  }

  return response.data.response[0].name;

//   try {
//     const response = await axios(options);

//     if (response.data.response.length === 0) {
//         throw new Error("")
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
}


module.exports = {getAirport};
