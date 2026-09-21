import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';
import { NiproImePTrainingPage } from '../pages/NiproImePTrainingPage';

test(
    'Admin creates IMEP training',
    {
        tag: ['@smoke', '@regression']
    },
    async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const imepPage = new NiproImePTrainingPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await imepPage.gotoCreateTraining();

        await imepPage.fillMandatoryFields();

        await imepPage.publishAndSave();

        await expect(page).toHaveURL(
            /\/training\/automation-imep-training/
        );
    }
);
