import { faker } from "@faker-js/faker/locale/fr"

export const fieldGenerators: Record<string, () => unknown> = {
    email: () => faker.internet.email(),
    firstname: () => faker.person.firstName(),
    lastname: () => faker.person.lastName(),
    name: () => faker.person.fullName(),
    phone: () => faker.phone.number(),
    address: () => faker.location.streetAddress(),
    street: () => faker.location.streetAddress(),
    city: () => faker.location.city(),
    country: () => faker.location.country(),
    zipcode: () => faker.location.zipCode(),
    avatar: () => faker.image.avatar(),
    url: () => faker.internet.url(),
    password: () => faker.internet.password(),
    id: () => faker.string.uuid(),
    _id: () => faker.string.uuid(),
    date: () => faker.date.recent(),
    createdat: () => faker.date.recent(),
    datecreation: () => faker.date.birthdate(),
    company: () => faker.company.name(),
    job: () => faker.person.jobTitle(),
    description: () => faker.lorem.paragraph(),
    title: () => faker.lorem.sentence(),
};

export const typeGenerators: Record<string, () => unknown> = {
    string: () => faker.lorem.words(),
    number: () => faker.number.int({ min: 1, max: 1000 }),
    boolean: () => faker.datatype.boolean(),
};