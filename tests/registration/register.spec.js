import { test, expect } from "@playwright/test";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/registerPage";
import { generateUser } from "../../utils/userData";

const user = generateUser();

test.describe("Registration - Positive", () => {
  test("Register new Account", async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await page.goto("/");

    await homePage.clickLoginLink();
    await loginPage.clickRegisterLink();
    await registerPage.register(user, { clickButton: false, fillName: true });
  });

  test.describe("Registration - Negative", () => {
    test("Missing First Name", async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const registerPage = new RegisterPage(page);

      await page.goto("/");

      await homePage.clickLoginLink();
      await loginPage.clickRegisterLink();
      await registerPage.register(user, {
        clickButton: true,
        fillName: false,
      });

      await expect(page).toHaveURL(/register/);
    });

    test("Invalid email format", async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const registerPage = new RegisterPage(page);

      const user = generateUser();
      user.email = user.email.replace("@", "");

      await page.goto("/");

      await homePage.clickLoginLink();
      await loginPage.clickRegisterLink();
      await registerPage.register(user, {
        clickButton: true,
        fillName: true,
      });

      await expect(page).toHaveURL(/register/);
    });
  });

  test.describe("Registration - Edge Cases", () => {
    test("Password less than minimum length", async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const registerPage = new RegisterPage(page);

      const user = generateUser();
      user.password = user.password.slice(0, 4);

      await page.goto("/");

      await homePage.clickLoginLink();
      await loginPage.clickRegisterLink();
      await registerPage.register(user, {
        clickButton: true,
        fillName: true,
      });

      await expect(
        page.getByText("Password is too short (minimum is 5 characters)")
      ).toBeVisible();
    });
  });
});
