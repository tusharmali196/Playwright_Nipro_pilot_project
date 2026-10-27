import { expect } from '@playwright/test';

export class ImePTrainingRegistrationPage {
    constructor(page) {
        this.page = page;

        this.registerNow = page.getByRole('button', {
            name: 'Register Now'
        });

        this.continueButton = page.locator(
            '[data-drupal-selector="edit-actions-wizard-next"]'
        );

        this.firstName = page.locator(
            '[data-drupal-selector="edit-first-name"]'
        );

        this.lastName = page.locator(
            '[data-drupal-selector="edit-last-name"]'
        );

        this.email = page.locator(
            '[data-drupal-selector="edit-email"]'
        );

        this.hospitalSchool = page.locator(
            '[data-drupal-selector="edit-hospital-school"]'
        );

        this.healthcareNumber = page.locator(
            '[data-drupal-selector="edit-healthcare-number"]'
        );

        this.doctorRadio = page.locator(
            '[data-drupal-selector="edit-functions-radios-doctor"]'
        );

        this.niproWebsiteRadio = page.getByLabel(
            'NIPRO Website'
        );

        this.consent = page.locator(
            '[data-drupal-selector="edit-consent"]'
        );

        this.registerButton = page.locator(
            '[data-drupal-selector="edit-actions-submit"]'
        );

        this.confirmationMessage = page.getByText(
            "Great! You’re slot has been confirmed",
            { exact: true }
        );

        this.registeredMessage = page.getByText(
            'You have now registered for :',
            { exact: true }
        );

        this.returnToImePTraining = page.getByRole(
            'link',
            {
                name: 'Return to Imep Training'
            }
        );
        this.trainingSlotDropdown = page.locator('[data-drupal-selector="edit-training-slot"]');
    }

    async gotoTraining() {
        await this.page.goto(
            '/training/automation-imep-training-1'
        );
    }

    
    
    async openRegistration() {
        await expect(
           this.trainingSlotDropdown
        ).toBeVisible();

        await this.trainingSlotDropdown.selectOption({
           index: 1
        });

        await expect(
           this.registerNow
        ).toBeVisible();

        await this.registerNow.click();

        const timeSlots = this.page.locator(
            '[data-drupal-selector="edit-nipro-training-slots-element"] .form-item__radio'
        );

        await expect(
             this.page.locator(
            '[data-drupal-selector="edit-nipro-training-slots-element"]'
           )
        ).toBeVisible();

         await expect(timeSlots).toHaveCount(2);

         await timeSlots.nth(1).click();

         await expect(
            timeSlots.nth(1).locator('input[type="radio"]')
        ).toBeChecked();

        await expect(
           this.continueButton
        ).toBeVisible();

         await this.continueButton.click();
    }
    async validateEmptySubmit() {
        await expect(this.firstName).toBeVisible();

        await this.registerButton.click();

        const requiredFields = [
           this.firstName,
           this.lastName,
           this.email,
           this.consent
       ];

       for (const field of requiredFields) {
           expect(
               await field.evaluate(el => !el.checkValidity())
            ).toBe(true);
        }
    }

    async fillRegistrationForm() {
        await this.firstName.fill('Automation');

        await this.lastName.fill('Test');

        await this.email.fill(
            `imep.test.${Date.now()}@example.com`
        );

        await this.hospitalSchool.fill(
            'Automation Hospital'
        );

        await this.selectIndia();

        await this.healthcareNumber.fill(
            'HIN123456'
        );

        await this.doctorRadio.check();

        await expect(
            this.doctorRadio
        ).toBeChecked();

        await this.niproWebsiteRadio.check();

        await expect(
            this.niproWebsiteRadio
        ).toBeChecked();

        await this.consent.check();

        await expect(
            this.consent
        ).toBeChecked();
    }

    async selectIndia() {
       const countryDropdown = this.page.getByRole('combobox', {
           name: 'Country'
       });

        await expect(countryDropdown).toBeVisible();

        await countryDropdown.selectOption({
           label: 'India'
        });

        await expect(countryDropdown).toHaveValue('IN');
    }

    async submitRegistration() {
        await expect(
            this.registerButton
        ).toBeVisible();

        await this.registerButton.click();
    }

    async verifyRegistrationSuccess() {
        await expect(
            this.confirmationMessage
        ).toBeVisible();

        await expect(
            this.registeredMessage
        ).toBeVisible();

        await expect(
            this.page.getByRole('heading', {
                name: 'Automation IMEP Training'
            })
        ).toBeVisible();
    }

    async returnToTraining() {
        await expect(
            this.returnToImePTraining
        ).toBeVisible();

        await this.returnToImePTraining.click();
    }

    async verifyReturnedToTraining() {
        await expect(this.page).toHaveURL(
        /\/training\/automation-imep-training-\d+/
    );

        await expect(
            this.page.getByRole('heading', {
                name: 'Automation IMEP Training'
            })
        ).toBeVisible();

        await expect(
            this.page.getByText('Expert level', {
                exact: true
            })
        ).toBeVisible();
    }
}
