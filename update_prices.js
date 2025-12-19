
const fs = require('fs');
const path = require('path');

// Hardcoded path to the data file
const pricingDataPath = '/Users/cavon/Downloads/iCloud price/src/data/pricingData.js';

const rates = {
  NGN: 0.0048, PKR: 0.0251, RUB: 0.0878, KRW: 0.00475, EGP: 0.1484,
  INR: 0.078, ZAR: 0.4196, PHP: 0.1201, MXN: 0.3921, IDR: 0.00042,
  MYR: 1.72, KZT: 0.0138, CAD: 5.11, TRY: 0.165, AUD: 4.66,
  COP: 0.0018, TWD: 0.2232, NZD: 4.0764, TZS: 0.0028, JPY: 0.0455,
  HKD: 0.905, SAR: 1.878, AED: 1.92, BRL: 1.277, THB: 0.223,
  PEN: 2.097, RON: 1.625, SGD: 5.463, EUR: 8.26, ILS: 2.188,
  HUF: 0.0212, NOK: 0.6916, CZK: 0.3406, CHF: 8.867, SEK: 0.7575,
  GBP: 9.4281, PLN: 1.96225, DKK: 1.10795, USD: 7.0515, CNY: 1,
};

// Helper to extract a numerical price from a formatted string
function getPrice(priceString) {
  if (typeof priceString !== 'string') {
    return 0;
  }
  // Remove currency symbols, commas, and other non-numeric characters
  return parseFloat(priceString.replace(/[^\d.]/g, ''));
}

// Read the entire file
let content = fs.readFileSync(pricingDataPath, 'utf8');

// This is a hacky way to "evaluate" the arrays in the file.
// It relies on the structure being consistent.
// It extracts the array definitions, then uses the Function constructor
// to turn them into actual JavaScript objects.
const pricingDataString = /export const pricingData = (\[[\s\S]*?\]);/.exec(content)[1];
const iphone17PricingDataString = /export const iphone17PricingData = (\[[\s\S]*?\]);/.exec(content)[1];

const pricingData = new Function(`return ${pricingDataString}`)();
const iphone17PricingData = new Function(`return ${iphone17PricingDataString}`)();

// Update iCloud pricing
const updatedPricingData = pricingData.map(countryData => {
  const newPlans = {};
  for (const plan in countryData.plans) {
    const price = getPrice(countryData.plans[plan].price);
    const rate = rates[countryData.currency];
    if (rate) {
        newPlans[plan] = {
            ...countryData.plans[plan],
            cny: parseFloat((price * rate).toFixed(2)),
        };
    } else {
        newPlans[plan] = countryData.plans[plan];
    }
  }
  return { ...countryData, plans: newPlans };
});

// Update iPhone 17 pricing
const updatedIphone17PricingData = iphone17PricingData.map(countryData => {
  const newModels = {};
  for (const model in countryData.models) {
    newModels[model] = {};
    for (const storage in countryData.models[model]) {
      const price = getPrice(countryData.models[model][storage].price);
      const rate = rates[countryData.currency];
      if (rate) {
          newModels[model][storage] = {
            ...countryData.models[model][storage],
            cny: Math.round(price * rate),
          };
      } else {
          newModels[model][storage] = countryData.models[model][storage];
      }
    }
  }
  return { ...countryData, models: newModels };
});


// The following function is a hack to format the JS object back to a string
// that resembles the original file's formatting. It's not perfect.
function formatObject(obj) {
  let str = JSON.stringify(obj, (key, value) => {
    if (key === 'best' || key === 'price' || key === 'cny' || key === 'currency' || key === 'country') {
      return value;
    }
    return value;
  }, 2);

  // Convert JSON string to look more like a JS object literal
  str = str.replace(/"([^"]+)":/g, '$1:'); // Remove quotes from keys
  str = str.replace(/"/g, "'"); // Replace double quotes with single quotes

  return str;
}

// Replace the old data structures with the new, updated ones.
content = content.replace(pricingDataString, formatObject(updatedPricingData));
content = content.replace(iphone17PricingDataString, formatObject(updatedIphone17PricingData));


// Write the updated content back to the file
fs.writeFileSync(pricingDataPath, content, 'utf8');

console.log('pricingData.js has been updated with the latest exchange rates.');
