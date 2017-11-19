// Packages
const { green, yellow, red } = require('chalk');
const { get } = require('axios');

// Mine
const config = require('./config')();
const endpoint = 'https://creativecommons.tankerkoenig.de/json/list.php';
const options = {
  latitude: config.latitude,
  longitude: config.longitude,
  radius: 1,
  sort: 'price',
  type: config['fuelapi.type'],
  token: config['fuelapi.token']
};
const severities = [
  // Todo: Should be made configurable
  {
    max: 1.299,
    color: green
  },
  {
    max: 1.399,
    color: yellow
  },
  {
    max: Number.MAX_VALUE,
    color: red
  }
];

const pickSeverityFrom = station => {
  for (let severity of severities) {
    if (station.price <= severity.max) return severity;
  }
  throw new Error('No severity matched, someone fucked that up...');
};

module.exports = async () => {
  const url = `${endpoint}?lat=${options.latitude}&lng=${options.longitude}&rad=${options.radius}&sort=${options.sort}&type=${options.type}&apikey=${options.token}`;
  const { data: responseBody } = await get(url);

  if (!responseBody.stations) throw new Error('No stations found');

  const closestStation = responseBody.stations[0];
  const severity = pickSeverityFrom(closestStation);

  return {
    closestStation,
    severity
  };
};
