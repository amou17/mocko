import { faker } from "@faker-js/faker/locale/fr"

export async function getJSON(fileName: string): Promise<JSON> {
    try {
        const file = await Deno.readTextFile(fileName);
        console.log("File content:", file);
        return JSON.parse(file);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        throw error;
    }
}

const fieldGenerators: Record<string, () => unknown> = {
    email: () => faker.internet.email(),
    firstname: () => faker.person.firstName(),
    lastname: () => faker.person.lastName(),
    name: () => faker.person.fullName(),
    phone: () => faker.phone.number(),
    address: () => faker.location.streetAddress(),
    city: () => faker.location.city(),
    country: () => faker.location.country(),
    zipcode: () => faker.location.zipCode(),
    avatar: () => faker.image.avatar(),
    url: () => faker.internet.url(),
    username: () => faker.internet.userName(),
    password: () => faker.internet.password(),
    id: () => faker.string.uuid(),
    date: () => faker.date.recent(),
    createdat: () => faker.date.recent(),
    datecreation: () => faker.date.birthdate(),
    company: () => faker.company.name(),
    job: () => faker.person.jobTitle(),
    description: () => faker.lorem.paragraph(),
    title: () => faker.lorem.sentence(),
};

const typeGenerators: Record<string, () => unknown> = {
    string: () => faker.lorem.words(),
    number: () => faker.number.int({ min: 1, max: 1000 }),
    boolean: () => faker.datatype.boolean(),
};

export async function analyzeSchemaJSON(fileName: string) {
    const jsonData = await getJSON(fileName);
    const fakeJSON = generateFakeValue(jsonData);
    console.log("Fake JSON:", JSON.stringify(fakeJSON, null, 2));
    return fakeJSON;
}

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