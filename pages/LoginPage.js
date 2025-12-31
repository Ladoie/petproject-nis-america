export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.registerLink = page.getByRole("link", { name: "Create an account" });
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }
}
