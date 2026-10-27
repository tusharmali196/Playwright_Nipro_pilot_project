import { expect } from '@playwright/test';

export class NiproAdminPage {

    constructor(page) {
        this.page = page;

        this.email = page.locator('[data-drupal-selector="edit-name"]');
        this.password = page.locator('[data-drupal-selector="edit-pass"]');
        this.signIn = page.getByRole('button', { name: 'Sign In', exact: true });
        this.forgotPassword = page.getByRole('link', { name: /forgot password/i });

        this.userSearch = page.locator('[data-drupal-selector="edit-user"]');
        this.filter = page.locator('[data-drupal-selector="edit-submit-user-admin-people"]');

        this.newPassword = page.locator('[data-drupal-selector="edit-pass-pass1"]');
        this.confirmPassword = page.locator('[data-drupal-selector="edit-pass-pass2"]');
        this.active = page.getByLabel('Active', { exact: true });
        this.save = page.getByRole('button', { name: 'Save', exact: true });
    }

       async login(username, password) {
       await this.page.goto('/user/login?destination=%2F', { waitUntil: 'domcontentloaded'});

       await expect(this.email).toBeVisible();
       await expect(this.password).toBeVisible();

       await this.email.fill(username);
       await this.password.fill(password);

       await this.signIn.click();

       await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyForgotPasswordVisible() { await expect(this.forgotPassword).toBeVisible(); }

    async searchUser(email) { 
        
      await this.page.goto('/admin/people', { waitUntil: 'domcontentloaded' });

      await expect(this.userSearch).toBeVisible({ timeout: 10000 });

      await this.userSearch.fill(email);

      await this.filter.click();

      const userRow = this.page.locator('tr').filter({ hasText: email });

      await expect(userRow).toBeVisible();

      await expect(userRow).toContainText('Active');

      await userRow.locator('a[href*="/edit?destination=/admin/people"]').click();    
    }

       async activateUser(password) {
       await expect(this.newPassword).toBeVisible();

       await this.newPassword.fill(password);

       await expect(this.confirmPassword).toBeVisible();

       await this.confirmPassword.fill(password);

       await this.active.check();

       await this.save.click();

       await this.page.waitForLoadState('commit');
    }

       async logout() {
       const userMenu = this.page.locator('#toolbar-item-user-secondary');

       await expect(userMenu).toBeVisible();
       await userMenu.hover();

       const logoutLink = this.page.locator('#toolbar-item-user-tray li.logout a[href*="/user/logout"]').last();

       await expect(logoutLink).toBeVisible();
       await logoutLink.click({ force: true });

      await this.page.waitForURL(/\/$/, { timeout: 10000 });
    }
}
