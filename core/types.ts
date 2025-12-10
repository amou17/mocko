import { faker } from "@faker-js/faker/locale/fr"

export const fieldGenerators: Record<string, () => unknown> = {
    email: () => faker.internet.email(),
    prenom: () => faker.person.firstName(),
    nom: () => faker.person.lastName(),
    name: () => faker.person.fullName(),
    address: () => faker.location.streetAddress(),
    ville: () => faker.location.city(),
    pays: () => faker.location.country(),
    codePostal: () => faker.location.zipCode(),
    url: () => faker.internet.url(),
    password: () => faker.internet.password(),
    id: () => faker.string.uuid(),
    _id: () => faker.string.uuid(),
    date: () => faker.date.recent(),
    createdat: () => faker.date.recent(),
    datecreation: () => faker.date.recent(),
    datereceptionCS: () => faker.date.recent(),
    sourcedate: () => faker.date.recent(),
    description: () => faker.lorem.paragraph(),
};

export const typeGenerators: Record<string, () => unknown> = {
    string: () => faker.lorem.words(),
    number: () => faker.number.int({ min: 1, max: 100 }),
    boolean: () => faker.datatype.boolean(),
    date:() => faker.date.recent(),
};