import { test as base, expect } from "@playwright/test";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const test = base.extend({
  registerPage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await page.goto("/");

    await homePage.clickLoginLink();
    await loginPage.clickRegisterLink();

    await use(registerPage);
  },
});

export { test, expect };
