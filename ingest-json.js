import constants from './constants.js'
import Redis from 'ioredis'
import {readFile} from 'fs/promises';

const redis = new Redis(constants.redis)

const getJson = async () => {
    const json = JSON.parse(
        await readFile(
            new URL('./resources/items.json', import.meta.url)
        ))
    console.log('Got json ' + JSON.stringify(json))

    return json
};

// Iterate through json array and add to Redis
const updateCache = async (json) => {
    await json.forEach( function (item) {
        redis.call("JSON.SET", "key:" + item.symbol, "$", JSON.stringify(item), (err, value) => {
            if (err) throw err;
            console.log(value.toString()); //-> 'OK'
        })

        console.log(`symbol sub: ${item.symbol.substring(1)}`)
        redis.call("FT.SUGADD", "fadd", item.symbol, 1)
    })

    console.log(`First symbol ${json[0].symbol}`)
    const first = await redis.call("JSON.GET", `key:${json[0].symbol}`, "$")
    console.log('first element ' + first)
    console.log('Cache updated')
}

const INDEX_NAME = "parentSymbolIndex"

const createIndex = async () => {
    await redis.call("ft.create",
        [INDEX_NAME, "on", "json", "prefix", 1, "key:", "schema", "$.parentSymbol", "as", "parentSymbol", "text"],
        (err, value) => {
            if (err) throw err;
            console.log(value.toString()); //-> 'OK'
        })
}

const quit = async () => {
    console.log('Exiting')
    redis.close()
    process.exit()
}

const json = await getJson()

await updateCache(json)

await createIndex()

console.log('done')

