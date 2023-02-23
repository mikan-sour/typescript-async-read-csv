import fs from 'fs/promises';
import { readCSV, readCSVToJson } from "../index";

const mockCSV = 'id,fname,lname\n1,Nicholas,Cage\n2,Sean,Bean';
const mockFP = `${__dirname}/test.csv`;

async function setupTest(content:string){
    try {
        await fs.writeFile(mockFP,content, 'utf-8')
    } catch (error) {
        throw error
    }
}

async function teardownTest() {
    try {
        await fs.unlink(mockFP);
    } catch (error) {
        throw error
    }
}

function getErrorMsg(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

const mockReadFile = jest.fn().mockImplementation(() => mockCSV)

jest.mock('fs', () => ({
    promises: {
      readFile: mockReadFile,
    },
}));  

describe("reading a csv to array of arrays",() => {
    beforeEach(async () => {
        await setupTest(mockCSV)
    })
    afterEach(async() => {
        await teardownTest()
        jest.restoreAllMocks();
      });
    it("reads it to an array", async () => {
        const data = await readCSV(mockFP);
        expect(data[0]).toContain('1')
        expect(data[0]).toContain('Nicholas')
        expect(data[0]).toContain('Cage')
        expect(data[1]).toContain('2')
        expect(data[1]).toContain('Sean')
        expect(data[1]).toContain('Bean')
    })
})

describe('reading a csv to array of arrays but it fails', () => {
    it("throws ENOENT err", async () => {
        try {
            await readCSV('./nomatch/nomatch.csv');
        } catch (e) {
            const msg = getErrorMsg(e)
            expect(msg).toEqual('Error: ENOENT: no such file or directory, open \'./nomatch/nomatch.csv\'');
        }
    })
})

type TMockPerson = {
    id: string,
    fname:string,
    lname:string,
}

describe("reading a csv to array of json objects",() => {
    beforeEach(async () => {
        await setupTest(mockCSV)
    })
    afterEach(async() => {
        await teardownTest()
        jest.restoreAllMocks();
      });
    it("reads it to an array", async () => {
        const data = await readCSVToJson<TMockPerson>(mockFP);
        expect(data[0].id).toEqual('1')
        expect(data[0].fname).toEqual('Nicholas')
        expect(data[0].lname).toEqual('Cage')
        expect(data[1].id).toEqual('2')
        expect(data[1].fname).toEqual('Sean')
        expect(data[1].lname).toEqual('Bean')
    })
})

describe('reading a csv to array of json but it fails', () => {
    it("throws ENOENT err", async () => {
        try {
            await readCSVToJson('./nomatch/nomatch.csv');
        } catch (e) {
            const msg = getErrorMsg(e)
            expect(msg).toEqual('Error: ENOENT: no such file or directory, open \'./nomatch/nomatch.csv\'');
        }
    })
})
