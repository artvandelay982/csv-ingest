/* eslint-disable no-await-in-loop */
const { execSync } = require('child_process');
const stringify = require('csv-stringify');
const faker = require('faker');
const { createWriteStream } = require('fs');
const { shuffle } = require('lodash');

const CSV_PATH = `${__dirname}/files`;
exports.CSV_PATH = CSV_PATH;

const columns = [
  'vin',
  'make',
  'model',
  'mileage',
  'year',
  'price',
  'zip',
  'state',
  'city',
  'country',
];

const randomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);

const generateColumns = () => {
  const genColumns = shuffle(columns);
  const numColumns = Math.floor(Math.random() * columns.length) + 1;
  return shuffle(['uuid', ...genColumns.slice(0, numColumns)]);
};

const generateProvider = () => ({
  columns: generateColumns(),
  name: faker.company.companyName(),
});

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0; const
    v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

const generateRow = (genColumns) => genColumns.map((column) => {
  switch (column) {
    case 'uuid':
      return uuidv4();
    case 'vin':
      return faker.random.alphaNumeric(16);
    case 'make':
    case 'model':
      return faker.name.lastName();
    case 'mileage':
      return randomNumber(2, 250000);
    case 'year':
      return randomNumber(1997, 2021);
    case 'price':
      return faker.commerce.price(3000, 100000);
    case 'zip':
      return faker.address.zipCode();
    case 'state':
      return faker.address.state();
    case 'city':
      return faker.address.city();
    case 'country':
      return faker.address.country();
    default:
      return '';
  }
});

const writeRows = (rows, stringifyOpts, stream) => new Promise((resolve) => {
  const csvStream = stringify(rows, stringifyOpts).pipe(stream);
  csvStream.on('close', () => resolve());
});

const MAX_ROWS = 10000;
const generateCsv = async (genColumns, numRows, filename) => {
  let header = true;
  let rowsRemaining = numRows;
  const filePath = `${CSV_PATH}/${filename}.csv`;

  // write MAX_ROWS at a time to a csv
  // prevents heap overflow when generating large csvs
  while (rowsRemaining > 0) {
    const rowsToWrite = Math.min(MAX_ROWS, rowsRemaining);
    const rows = [];
    for (let i = 0; i < rowsToWrite; i += 1) {
      rows.push(generateRow(genColumns));
    }

    // write rows to csv
    await writeRows(
      rows,
      { header, columns: genColumns },
      createWriteStream(filePath, { flags: 'a' }),
    );

    // first write only
    if (header) header = false;

    // update remaining
    rowsRemaining -= rowsToWrite;
  }
};


exports.generate = async (numCsvs, numRows) => {
  // clear cache
  execSync(`rm -rf ${CSV_PATH}`);
  execSync(`mkdir -p ${CSV_PATH}`);

  const providers = [];
  for (let i = 0; i < numCsvs; i += 1) {
    const provider = generateProvider();
    providers.push(provider);
    await generateCsv(provider.columns, numRows, provider.name);
  }

  return providers;
};
exports.generate(1, 100);
