import { faker } from "@faker-js/faker/locale/fr"

import { fieldGenerators, typeGenerators } from "./types.ts";

/**
 * Read and parse JSON file
 * @param fileName 
 * @returns 
 */
export async function getJSON(fileName: string): Promise<JSON> {
    try {
        const file = await Deno.readTextFile(fileName);
        return JSON.parse(file);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        throw error;
    }
}

/**
 * Analyze schema from JSON file and generate fake data
 * @param fileName 
 * @returns 
 */
export async function analyzeSchemaJSON(fileName: string): Promise<unknown> {
    const jsonData = await getJSON(fileName);
    const fakeJSON = generateFakeValue(jsonData);

    return fakeJSON;
}

/**
 * Generate fake value based on the provided schema
 * @param value 
 * @param key 
 * @returns 
 */
function generateFakeValue(value: unknown, key?: string): unknown {
    if (Array.isArray(value)) {
        if (value.length === 0) return [];
        const template = value[0];
        const count = faker.number.int({ min: 1, max: 5 });
        return Array.from({ length: count }, () => generateFakeValue(template));
    }

    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, generateFakeValue(v, k)])
        );
    }

    if (key) {
        const fieldKey = key.toLowerCase();
        if (fieldGenerators[fieldKey]) {
            return fieldGenerators[fieldKey]();
        }
    }

    const valueType = typeof value;
    const generator = typeGenerators[valueType];
    return generator ? generator() : value;
}