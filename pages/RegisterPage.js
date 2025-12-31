export default class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByLabel("First name");
    this.lastNameInput = page.getByLabel("Last name");
    this.emailInput = page.getByLabel("E-mail");
    this.passwordInput = page.getByLabel("Password");
    this.button = page.getByRole("button", { name: "Create account" });
  }

  async register(user, options = { clickButton: true, fillName: true }) {
    if (options.fillName) {
      await this.firstNameInput.fill(user.firstName);
    }
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);

    if (options.clickButton) {
      await this.button.click();
    }
  }
}
