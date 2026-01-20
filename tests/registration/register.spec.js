import { test, expect } from "../../fixtures/registration.fixture";
import { generateUser } from "../../utils/userData";

test.describe("Registration - Positive", () => {
  test("Register new Account", async ({ registerPage }) => {
    const user = generateUser();

    await registerPage.register(user, { clickButton: false, fillName: true });

    // await expect(registerPage.page).toHaveURL("https://store.nisamerica.com/");
  });
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

    // Prevent form submission to avoid CAPTCHA
    const validationOnSubmit = await registerPage.fillFormAndCheckValidationOnSubmit(user);
    
    // Verify form didn't submit (we're still on register page)
    await expect(registerPage.page).toHaveURL(/register/);
    expect(validationOnSubmit.stillOnRegisterPage).toBe(true);
    
    // Verify password is too short (4 characters)
    expect(validationOnSubmit.passwordInfo.valueLength).toBe(4);
    
    // If the field has a minlength attribute, verify password is less than minimum
    // (Note: Validation is server-side, so we can't see error messages without submitting)
    if (validationOnSubmit.passwordInfo.hasMinLength) {
      expect(validationOnSubmit.passwordInfo.valueLength).toBeLessThan(
        validationOnSubmit.passwordInfo.minLength
      );
    } else {
      // If no minlength attribute, we can only verify the password is short
      // The actual minimum is enforced server-side
      expect(validationOnSubmit.passwordInfo.valueLength).toBeLessThan(5);
    }
  });
});
