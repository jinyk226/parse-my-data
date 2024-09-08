"use server"
import { data } from "../../../input/data";
import { writeFile } from "fs";
export const getFitnessData = async () => {
    console.log('starting data write...');
    const headers = [
        null,
        null,
        null,
        null,
        'time',
        null,
        null,
        'distance',
        null,
        null,
        'bpm',
        null,
        null,
        'm/s'
    ];

    let startTime: number | undefined;

    let cleanedData = data.split('\n').map((row) => row.split('\t').map((col, i) => {
        if (headers[i]) {
            if (headers[i] === 'distance' && !startTime && Number(col.slice(1, col.length - 1)) > 0) {
                const tempRow = row.split('\t');
                startTime = Number(tempRow[4].slice(1, tempRow[4].length - 1));
                return col.slice(1, col.length - 1);
            }
            if (headers[i] === 'time' && startTime) {
                return Number(col.slice(1, col.length - 1)) - startTime;
            }
            if (startTime) {
                return col.slice(1, col.length - 1) || 0;
            }
        }
        return null;
    }).filter((val) => !!val).join('\t')).join('\n');

    // cleanedData = `${headers.filter((val) => !!val).join('\t')}\n${cleanedData}`; // Uncomment to add headers
    const writeDir = 'output/cleanedData.txt';
    writeFile(writeDir, cleanedData, (err) => {
        if (err) {
            throw err;
        }
    });
    console.log('startTime:', startTime);
    console.log(`backend data written to ${writeDir}`);
};