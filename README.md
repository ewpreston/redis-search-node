# Search
Simple search example for JSON documents.
There's a sample json file in resources/items.json. If you need to change the schema, you'll need to change the indexing and searching.

This example uses ioredis to show how to execute search commands, since ioredis doesn't have API support for search.

## Prerequisites
- Node.js
- Redis
- ioredis

## Installing this application

Clone the repository to your computer:

Install dependencies:
```bash
npm install 
```

## Database Preparation

Ensure you have Redis installed and running.

For Docker:
```bash
$ docker run -p 6379:6379 --name redis6 -d redis:6 
```

### `ingest-json.js`

This file ingests json from the file `resources/items.json1`, creates an index and adds the json documents to Redis

```bash
$ node ingest-json.js
```

### `search.js`

This file executes a search against the populated Redis database

```bash
$ node search.js <text>
```

### `suggest.js`

This file uses FT.SUGGET to return the values that start with the characters provided. It's commonly used for autocomplete

```bash
$ node suggest.js <text>
```

