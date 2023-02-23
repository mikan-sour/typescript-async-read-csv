import {readFile} from 'fs/promises';

export const readCSV = async (filepath:string):Promise<string[][]> => {
    try {
        const rawData = await readFile(filepath);
        const dataLines = rawData.toString().split("\n");
        dataLines.shift();
        return dataLines.map(line => line.split(','));
    } catch (error) {
        throw error
    }
}

export const readCSVToJson = async <T>(filepath:string):Promise<T[]> => {
    try {
        const rawData = await readFile(filepath);
        const dataLines = rawData.toString().split("\n").map(line => line.split(','));
        const header = dataLines.shift()!;
        return dataLines.map(line => line.reduce((a,b,i) => {
            return {...a,[header[i]]:b};
        },{} as T));

    } catch (error) {
        throw error;
    }
}

