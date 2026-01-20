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

  /**
   * Check if password field has HTML5 validation error
   * This allows checking validation without submitting the form (avoiding CAPTCHA)
   */
  async checkPasswordValidation() {
    const passwordInput = this.passwordInput;
    
    // Trigger validation by attempting to submit or checking validity
    // First, try to get the validation message
    const isValid = await passwordInput.evaluate((input) => {
      return input.validity.valid;
    });
    
    const validationMessage = await passwordInput.evaluate((input) => {
      return input.validationMessage;
    });

    return {
      isValid,
      validationMessage,
    };
  }

  /**
   * Fill form and check validation without submitting
   */
  async fillFormAndCheckValidation(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    
    // Trigger validation by blurring the field or checking form validity
    await this.passwordInput.blur();
    
    // Wait a bit for any validation messages to appear
    await this.page.waitForTimeout(300);
    
    return await this.checkPasswordValidation();
  }

  /**
   * Get password field attributes and current value
   */
  async getPasswordFieldInfo() {
    return await this.passwordInput.evaluate((input) => {
      return {
        value: input.value,
        valueLength: input.value.length,
        minLength: input.minLength,
        maxLength: input.maxLength,
        hasMinLength: input.hasAttribute('minlength'),
        hasMaxLength: input.hasAttribute('maxlength'),
        type: input.type,
        required: input.required,
      };
    });
  }

  /**
   * Fill form and attempt submission, but prevent it to avoid CAPTCHA
   * This checks for validation errors that appear after clicking submit
   */
  async fillFormAndCheckValidationOnSubmit(user) {
    // Store current URL to verify we don't navigate away
    const initialUrl = this.page.url();

    // Prevent form submission by intercepting the submit event
    await this.page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, { capture: true, once: false });
      });
    });

    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    
    // Get password field info after filling
    const passwordInfo = await this.getPasswordFieldInfo();
    
    // Click submit - form won't actually submit due to preventDefault
    await this.button.click();
    
    // Wait for any validation messages to appear (JavaScript validation might be async)
    await this.page.waitForTimeout(1000);
    
    // Check for validation messages on the page - try multiple selectors
    const errorSelectors = [
      '[role="alert"]',
      '.error',
      '.validation-error',
      '[class*="error"]',
      '[class*="Error"]',
      '[class*="invalid"]',
      '[class*="Invalid"]',
      'p.error',
      'div.error',
      'span.error',
    ];
    
    const errorMessages = [];
    for (const selector of errorSelectors) {
      const elements = await this.page.locator(selector).all();
      for (const element of elements) {
        const text = await element.textContent();
        if (text && text.trim().length > 0) {
          errorMessages.push(text.trim());
        }
      }
    }
    
    // Also check for password-specific validation
    const passwordValidation = await this.checkPasswordValidation();
    
    // Verify we're still on the same page (form didn't submit)
    const currentUrl = this.page.url();
    const stillOnRegisterPage = currentUrl.includes('register') || currentUrl === initialUrl;
    
    return {
      ...passwordValidation,
      passwordInfo,
      errorMessages: [...new Set(errorMessages)], // Remove duplicates
      stillOnRegisterPage,
    };
  }
}
