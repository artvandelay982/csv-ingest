// process csv file into a feathers service
const { EOL } = require('os');
const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const parse = require('csv-parse/lib/sync');

// max rows to read into memory at once
const MAX_ROWS = 10000;

module.exports = async ({
  path, // file path of csv
  service, // service to save csv rows to
  columns, // array of column names in order
}) => {
  const csvOptions = {
    relaxColumnCount: true, // ignore extra columns
    columns: true,
    skip_empty_lines: true,
    record_delimiter: EOL,
  };
  try {
    const rl = createInterface({
      input: createReadStream(path),
      crlfDelay: Infinity,
    });

    // headers are read on first read, dont add them until second parse
    let headers = true;

    let linesRead = 0;
    let linesOverflow = 0;
    let rows = '';
    let rowsOverflow = '';

    // listen for line read events and add them for parsing
    rl.on('line', async (line) => {
      // handle readline drip
      if (linesRead >= MAX_ROWS) {
        rowsOverflow += `${line}${EOL}`; // add new line
        linesOverflow += 1;
        return;
      }

      rows += `${line}${EOL}`;
      linesRead += 1;

      // add rows to db before reading more into memory
      if (linesRead >= MAX_ROWS) {
        rl.pause();

        // add columns to top of rows
        if (!headers) rows = `${columns}${EOL}${rows}`;

        // parse csv string to array of objects
        const parsedRows = parse(rows, csvOptions);
        await service.create(parsedRows);

        // reset max lines
        linesRead = linesOverflow;
        linesOverflow = 0;
        rows = rowsOverflow;
        rowsOverflow = '';

        if (headers) headers = false;

        rl.resume();
      }
    });

    await once(rl, 'close');

    // add any remaining rows read
    if (rows.length) {
      if (!headers) rows = `${columns}${EOL}${rows}`;
      const parsedRows = parse(rows, csvOptions);
      await service.create(parsedRows);
    }
  } catch (err) {
    console.error('CSV processing error', err);
  }
};
