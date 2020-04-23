# vehicle-entity-loader

Load vehicle entity data from a csv into a supported db.

The app is hosted at http://localhost:3030

It is recommended to use Postman or a similar HTTP GUI with this app


## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) >= 13.13.0 and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/vehicle-entity-loader
    yarn install
    ```

3. Start your app

    ```
    yarn start
    ```

## Loading a csv

Upload a CSV by Posting a multipart/form-data request with a csv attached to the "csv" key to the /upload endpoint using a GUI like Postman. Include in the "provider" query param the name of the provider configuration to use for ingest.

`POST http://localhost:3030/upload?providerName=name mutlipart/form-data { csv: <...csv file> }`

Alternatively, vehicle inventory/providers can be seeded via a POST to the /vehicle-inventory-seed like:

`POST http://localhost:3030/vehicle-inventory-seed?numRows=100&numCsvs=3`

This will generate csv random data and provider names/configs, and load them into the vehicle-inventory sqlite table.

Sqlite data can be browsed/queried by opening the vehicle_entity_loader.sqlite file in the root of this project using a GUI like DB Browser for SQLite or a sqlite command line utility.

## Design Decisions

The Vehicle entity was designed with the assumption in mind that created_at/updated_at times would be handled by the database automatically. This is acheived with [Sequelize](https://sequelize.org/) by default.

A provider configuration is stored in the vehicle-provider sqlite table and consists of a provider name and array of columns in order of appearance in the csv they will upload. This configuration can be changed at any time by doing an update:

`UPATE http://localhost:3030/vehicle-provider {name: 'provider name', columns: ['column1', 'column2', ...]}`

A new provider can be created by calling

`POST http://localhost:3030/vehicle-provider {name: 'provider name', columns: ['column1', 'column2', ...]}`

This app implements file streaming in order to generate/load large csv files. This prevents large csvs from overloading the heap and causing node to crash. This allows it to generate and load csv files that are several million lines without issue.

`POST http://localhost:3030/vehicle-inventory-seed?numRows=2000000&numCsvs=1`

## Assumptions

It is assumed that uuid field is always populated since as it is the primary field for the sqlite db. If it needs to be the case that even uuid field is sometimes not included, this could be solved by autogenerating one before writing to the db. This was not done because the assumption was that vehicle providers will want to update vehicle data with existing uuids in the db, and can only be accomplished with a unique identifier.

## Architecture

The Feathers framework enforces many architectural conventions by default. Using CLI tools to generate services allows file structure and imports to be generated automatically. Code in the services/ folder consists of request/response handlers as well as hooks for processing REST events before/after they occur.

For example, in `services/upload/upload.hooks.js` the csv module is called to read, process, and load data into the vehicle-inventory service after a file upload completes. This allows a common interface for csv parsing and REST requests to the vehicle-inventory service. Since ingest into the DB happens through a common Feathers Service/REST interface it would be arbitrary to change the storage mechanism the service implements (e.g. in-memory to sqlite), as well as provide customers an API to update their vehicle inventory in addition to the already provided csv upload process. No new code needs to be written to allow an API update method beyond user authentication.

More on [Feathers Services](https://docs.feathersjs.com/api/services.html)

## Testing

The /vehicle-inventory-seed POST route was used to generate/populate a variety of csv file lengths and configurations. Random data was generated, including extraneous fields like zip codes and states to insure it would not affect the ingest process.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Running Tests

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
