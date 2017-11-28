// Packages
const axios = require('axios');

// Mines
const { 'pushover.token': pushoverToken, 'pushover.user': pushoverUser } = require('./config')();

module.exports.send = async (station, difference) => {
  const differenceInCent = (difference * 100).toFixed(0);
  const fixedPrice = station.price.toFixed(2);

  const parameter = {
    token: pushoverToken,
    user: pushoverUser,
    title: 'Fuel-Alert 🚨',
    message: `Fuel price dropped by ${differenceInCent} cents to ${fixedPrice}€ at ${station.brand} ${station.street} 🚗💨`
  };

  const { data } = await axios.post('https://api.pushover.net/1/messages.json', parameter);

  console.log(data);
};
