import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';

test('Admin activates user and user can login @smoke @regression', async ({ page }) => {

    const adminPage = new NiproAdminPage(page);

    await adminPage.login(
        process.env.ADMIN_EMAIL,
        process.env.ADMIN_PASSWORD
    );

    await adminPage.searchUser(process.env.TEST_USER_EMAIL);

    await adminPage.activateUser(process.env.TEST_USER_PASSWORD);

    await adminPage.logout();

    const loginLink = page.getByRole('link', { name: 'Log in', exact: true });

    await expect(loginLink).toBeVisible();
    await loginLink.click();

    await page.waitForTimeout(3000);

    await adminPage.email.fill(process.env.TEST_USER_EMAIL);
    await adminPage.password.fill(process.env.TEST_USER_PASSWORD);
    await adminPage.signIn.click();


});
