import constants from './constants.js'
import Redis from 'ioredis'
import {readFile} from 'fs/promises';

const redis = new Redis(constants.redis)

const suggest = async (value) => {
    const query = "'@parentSymbol:" + value + "'"
    await redis.call("FT.SUGGET",
        ["fadd", value],
        (err, value) => {
            if (err) throw err;
            console.log(value); //-> 'OK'
        })
}

// Now search for something

const args = process.argv

if (args.length < 3) {
    console.log('Please enter a search term')
    process.exit()
}

const value = args[2]

await suggest(value)

console.log('done')

process.exit()

