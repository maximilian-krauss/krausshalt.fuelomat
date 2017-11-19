require('dotenv').load({
  silent: true
});

const configurationParameter = [
  {
    name: 'pushover.token',
    environment: 'PUSHOVER_TOKEN',
    required: true
  },
  {
    name: 'pushover.user',
    environment: 'PUSHOVER_USER',
    required: true
  },
  {
    name: 'fuelapi.token',
    environment: 'FUEL_API_TOKEN',
    required: true
  },
  {
    name: 'fuelapi.type',
    environment: 'FUELAPI_TYPE',
    required: false,
    default: 'e5'
  },
  {
    name: 'longitude',
    environment: 'LONGITUDE',
    required: true
  },
  {
    name: 'latitude',
    environment: 'LATITUDE',
    required: true
  },
  {
    name: 'refreshIntervalInMinutes',
    environment: 'REFRESH_INTERVAL_IN_MINUTES',
    required: false,
    default: '10'
  },
  {
    name: 'priceNotificationThreshold',
    environment: 'PRICE_NOTIFICATION_THRESHOLD',
    required: false,
    default: '0.03'
  }
];

module.exports = () => {
  const config = {};
  for (let parameter of configurationParameter) {
    if (
      parameter.required &&
      !process.env.hasOwnProperty(parameter.environment)
    ) {
      throw new Error(
        `Required environment parameter ${parameter.name} is not set!`
      );
    }

    config[parameter.name] =
      process.env[parameter.environment] || parameter.default;
  }

  return config;
};
