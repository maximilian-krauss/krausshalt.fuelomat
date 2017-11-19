// Packages
const { red, gray } = require('chalk');

// Mine
const {
  refreshIntervalInMinutes,
  priceNotificationThreshold
} = require('./config')();
const { sleep } = require('./helper');
const fuelApi = require('./fuel-api');
const notification = require('./notification');
const RingBuffer = require('./ring-buffer');

const refreshInterval = 1000 * 60 * Number.parseInt(refreshIntervalInMinutes);
const priceDifferenceNotificationThreshold = Number.parseFloat(
  priceNotificationThreshold
);

const defaultApplicationState = {
  currentPrice: null,
  lastTimeRefreshed: null,
  trend: null,
  closestStation: null,
  priceHistory: []
};

let currentApplicationState = { ...defaultApplicationState };
const priceHistoryBuffer = new RingBuffer(50);

const log = message => console.log(`${gray(new Date())} ${message}`);

const doWork = async () => {
  do {
    try {
      const { closestStation, severity } = await fuelApi();

      const oldPrice = currentApplicationState.currentPrice || 0.0;
      const newPrice = closestStation.price;
      const newPriceIsLower = newPrice < oldPrice;
      const timestamp = new Date();

      priceHistoryBuffer.push({
        price: newPrice,
        timestamp
      });

      if (newPriceIsLower) {
        log('Price is lower');
        const priceDifference = oldPrice - newPrice;

        if (priceDifference >= priceDifferenceNotificationThreshold) {
          log(
            `Price difference (${priceDifference}) exceeds threshold, sending notification.`
          );
          await notification.send(closestStation, priceDifference);
        }
      }

      currentApplicationState = {
        ...defaultApplicationState,
        currentPrice: newPrice,
        lastTimeRefreshed: timestamp,
        trend: newPriceIsLower ? 'down' : 'up',
        closestStation,
        priceHistory: priceHistoryBuffer.toArray()
      };
    } catch (error) {
      console.error(
        `${red('[Error]')} Failed to update fuel prices: ${error.message}`
      );
    }

    await sleep(refreshInterval);
  } while (true);
};

module.exports.currentApplicationState = () => ({ ...currentApplicationState });
module.exports.doWork = doWork;
