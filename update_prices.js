import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pricingDataPath = path.join(__dirname, 'src/data/pricingData.js');
const ratesUrl = 'https://open.er-api.com/v6/latest/CNY';

function getPrice(priceString) {
  if (typeof priceString !== 'string') {
    throw new TypeError(`Invalid price: ${priceString}`);
  }

  const match = priceString.replaceAll(',', '').match(/\d+(?:\.\d+)?/);
  if (!match) {
    throw new Error(`Unable to parse price: ${priceString}`);
  }

  return Number(match[0]);
}

async function fetchRates() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(ratesUrl, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Exchange-rate request failed with HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (payload.result !== 'success' || payload.base_code !== 'CNY' || !payload.rates) {
      throw new Error('Exchange-rate response is invalid');
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function cnyRateFor(currency, rates) {
  if (currency === 'CNY') return 1;

  const foreignCurrencyPerCny = rates[currency];
  if (!foreignCurrencyPerCny) {
    throw new Error(`Missing exchange rate for ${currency}`);
  }

  return 1 / foreignCurrencyPerCny;
}

function updateIcloudPrices(pricingData, rates) {
  for (const countryData of pricingData) {
    const rate = cnyRateFor(countryData.currency, rates);
    for (const planData of Object.values(countryData.plans)) {
      planData.cny = Number((getPrice(planData.price) * rate).toFixed(2));
      planData.best = false;
    }
  }

  const plans = Object.keys(pricingData[0].plans);
  for (const plan of plans) {
    const minimum = Math.min(...pricingData.map((row) => row.plans[plan].cny));
    for (const row of pricingData) {
      row.plans[plan].best = row.plans[plan].cny === minimum;
    }
  }
}

function updateIphonePrices(iphoneData, rates) {
  const modelStoragePairs = new Set();

  for (const countryData of iphoneData) {
    const rate = cnyRateFor(countryData.currency, rates);
    for (const [model, storageOptions] of Object.entries(countryData.models)) {
      for (const [storage, item] of Object.entries(storageOptions)) {
        item.cny = Math.round(getPrice(item.price) * rate);
        item.best = false;
        modelStoragePairs.add(`${model}\u0000${storage}`);
      }
    }
  }

  for (const pair of modelStoragePairs) {
    const [model, storage] = pair.split('\u0000');
    const matchingItems = iphoneData
      .map((row) => row.models[model]?.[storage])
      .filter(Boolean);
    const minimum = Math.min(...matchingItems.map((item) => item.cny));

    for (const item of matchingItems) {
      item.best = item.cny === minimum;
    }
  }
}

function collectPriceItems(value, result = []) {
  if (!value || typeof value !== 'object') return result;

  if ('price' in value && 'cny' in value && 'best' in value) {
    result.push(value);
    return result;
  }

  for (const child of Object.values(value)) {
    collectPriceItems(child, result);
  }

  return result;
}

function patchCalculatedFields(arraySource, data) {
  const items = collectPriceItems(data);
  let cnyIndex = 0;
  let bestIndex = 0;

  const withCny = arraySource.replace(/\bcny:\s*-?\d+(?:\.\d+)?/g, () => {
    const item = items[cnyIndex++];
    if (!item) throw new Error('Found more cny fields than price items');
    return `cny: ${item.cny}`;
  });

  const withBest = withCny.replace(/\bbest:\s*(?:true|false)/g, () => {
    const item = items[bestIndex++];
    if (!item) throw new Error('Found more best fields than price items');
    return `best: ${item.best}`;
  });

  if (cnyIndex !== items.length || bestIndex !== items.length) {
    throw new Error(
      `Calculated-field count mismatch: ${items.length} items, ${cnyIndex} cny fields, ${bestIndex} best fields`
    );
  }

  return withBest;
}

async function main() {
  let content = fs.readFileSync(pricingDataPath, 'utf8');
  const pricingMatch = /export const pricingData = (\[[\s\S]*?\]);/.exec(content);
  const iphoneMatch = /export const iphone17PricingData = (\[[\s\S]*?\]);/.exec(content);

  if (!pricingMatch || !iphoneMatch) {
    throw new Error('Unable to locate pricing data exports');
  }

  const pricingData = new Function(`return ${pricingMatch[1]}`)();
  const iphone17PricingData = new Function(`return ${iphoneMatch[1]}`)();
  const ratePayload = await fetchRates();

  updateIcloudPrices(pricingData, ratePayload.rates);
  updateIphonePrices(iphone17PricingData, ratePayload.rates);

  content = content.replace(
    pricingMatch[1],
    patchCalculatedFields(pricingMatch[1], pricingData)
  );
  content = content.replace(
    iphoneMatch[1],
    patchCalculatedFields(iphoneMatch[1], iphone17PricingData)
  );

  fs.writeFileSync(pricingDataPath, content, 'utf8');
  console.log(`Updated prices using exchange rates from ${ratePayload.time_last_update_utc}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
