const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');
const fs = require('fs');

parse = (line) => {
    const [timestamp, logId, ...remainder] = line.split(',');

    const evaluationResults = remainder.join();

    // match EvaluationResult(...) blocks
    const regex = /EvaluationResult\(.*?EntityId=([\w-]+).*?Feature=([\w:\-\/]+).*?Reason=(\w+).*?Variation=(\w+)\)/g;

    const results = evaluationResults.matchAll(regex);

    let parsedResults = []

    for (let result of results) {
        // const raw = result[0];
        const entityId = result[1]
        const feature = result[2]
        const reason = result[3]
        const variation = result[4]

        const parsed = {
            timestamp,
            logId,
            entityId,
            feature,
            reason,
            variation,
        }

        parsedResults.push(parsed);
    }
    return parsedResults
}

const readStream = createReadStream('logs.txt');
const writeStream = createWriteStream('output.jsonl');

console.log('Starting processing...')
readStream.pipe(new Transform({
    transform(chunk, enc, cb) {
        console.log('Processing chunk...')
        // parse each chunk and extract data
        const lines = chunk.toString().split('\n');

        let output = '';

        for(let line of lines) {
            const parsed = parse(line);

            for(let evalResult of parsed) {
                output += JSON.stringify(evalResult) + '\n';
            }
        }

        cb(null, output);
    }
})).pipe(writeStream);
