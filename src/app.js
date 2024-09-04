import fs from 'node:fs/promises';
import { startFeesCalculation } from './fee-calculation.js';

const start = async (inputFilePath) => {
    try {
        const data = await fs.readFile(inputFilePath);
        startFeesCalculation(JSON.parse(data))
    } catch (err) {
        console.log(err);
    }
}

start(process.argv[2])


