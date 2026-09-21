import { test } from '@playwright/test';
import { ImePTrainingRegistrationPage } from '../pages/ImePTrainingRegistrationPage';

test.describe('IMEP Training Registration', () => {

    test('User can register successfully for IMEP training', async ({ page }) => {

        const imepRegistration =
            new ImePTrainingRegistrationPage(page);

        await imepRegistration.gotoTraining();

        await imepRegistration.openRegistration();

        await imepRegistration.validateEmptySubmit();

        await imepRegistration.fillRegistrationForm();

        await imepRegistration.submitRegistration();

        await imepRegistration.verifyRegistrationSuccess();

        await imepRegistration.returnToTraining();

        await imepRegistration.verifyReturnedToTraining();
    });
});
