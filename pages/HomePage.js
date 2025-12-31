export default class HomePage {
  constructor(page) {
    this.page = page;
    this.loginLink = page.getByRole("link", { name: "Login" });
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }
}
