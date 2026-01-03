import { test, expect } from "../../fixtures/registration.fixture";
import { generateUser } from "../../utils/userData";

test.describe("Registration - Positive", () => {
  test("Register new Account", async ({ registerPage }) => {
    const user = generateUser();

    await registerPage.register(user, { clickButton: false, fillName: true });

    // await expect(registerPage.page).toHaveURL("https://store.nisamerica.com/");
  });

  test.describe("Registration - Negative", () => {
    test("Missing First Name", async ({ registerPage }) => {
      const user = generateUser();

      await registerPage.register(user, {
        clickButton: true,
        fillName: false,
      });

      await expect(registerPage.page).toHaveURL(/register/);
    });

    test("Invalid email format", async ({ registerPage }) => {
      const user = generateUser();
      user.email = user.email.replace("@", "");

      await registerPage.register(user, {
        clickButton: true,
        fillName: true,
      });

      await expect(registerPage.page).toHaveURL(/register/);
    });
  });

  test.describe("Registration - Edge Cases", () => {
    test("Password less than minimum length", async ({ registerPage }) => {
      const user = generateUser();
      user.password = user.password.slice(0, 4);

      await registerPage.register(user, {
        clickButton: true,
        fillName: true,
      });

      // await expect(
      //   registerPage.page.getByText(
      //     "Password is too short (minimum is 5 characters)"
      //   )
      // ).toBeVisible();
    });
  });
});
