import constants from './constants.js'
import Redis from 'ioredis'
import {readFile} from 'fs/promises';

const redis = new Redis(constants.redis)

const search = async (value) => {
    const query = "'@parentSymbol:" + value + "'"
    await redis.call("FT.SEARCH",
        ["parentSymbolIndex", query, "RETURN", 1, "$.parentSymbol", "LIMIT", 0, 1000],
        (err, value) => {
            if (err) throw err;
            console.log(JSON.stringify(value, null, 2)); //-> 'OK'
        })
}

// Now search for something

const args = process.argv

if (args.length < 3) {
    console.log('Please enter a search term')
    process.exit()
}

const value = args[2]

await search(value)

console.log('done')

process.exit()

