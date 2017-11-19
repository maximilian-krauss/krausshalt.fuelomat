// Packages
const axios = require('axios');

// Mines
const {
  'pushover.token': pushoverToken,
  'pushover.user': pushoverUser
} = require('./config')();

module.exports.send = async (station, difference) => {
  const differenceInCent = (difference / 100).toFixed(1);
  const parameter = {
    token: pushoverToken,
    user: pushoverUser,
    title: 'Fuel-Alert 🚨',
    message: `Fuel price dropped by ${differenceInCent} cents to ${station.price}€ at ${station.brand} ${station.street} 🚗💨`
  };

  const { data } = await axios.post(
    'https://api.pushover.net/1/messages.json',
    parameter
  );

  console.log(data);
};
