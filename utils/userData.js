import { faker } from "@faker-js/faker";

export function generateUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ length: 12 }),
  };
}
