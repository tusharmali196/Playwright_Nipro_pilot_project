import { expect } from '@playwright/test';

export class NiproImePTrainingPage {
    constructor(page) {
        this.page = page;

        this.trainingTitle = page.getByRole('textbox', {
            name: 'Training Title *'
        });

        this.trainingType = page.getByRole('combobox', {
            name: 'Training Type *'
        });

        this.timeSlotRows = page.locator(
            '#field-training-date-time-values tbody tr'
        );

        this.addTimeSlotButton = page.getByRole('button', {
            name: 'Add Time slots',
            exact: true
        });

        this.durationDays = page.getByRole('spinbutton', {
            name: 'Days'
        });

        this.durationHours = page.getByRole('spinbutton', {
            name: 'Hours'
        });

        this.durationMinutes = page.getByRole('spinbutton', {
            name: 'Minutes'
        });

        this.domainCountry = page.getByRole('textbox', {
            name: /Domain Country/
        });

        this.addCountryButton = page.getByRole('button', {
            name: 'Add another item',
            exact: true
        }).first();

        this.trainingLevel = page.getByRole('combobox', {
            name: 'Training Level *'
        });

        this.imepCategory = page.getByRole('combobox', {
            name: 'iMEP Category *'
        });

        this.totalSlots = page.getByRole('spinbutton', {
            name: 'Total number of slots *'
        });

        this.trainingLanguage = page.getByRole('combobox', {
            name: 'Training Language *'
        });

        this.moderationState = page.locator(
            '[data-drupal-selector="edit-moderation-state-0-state"]'
        );

        this.saveButton = page.locator('[data-drupal-selector="gin-sticky-edit-submit"]');
    }

    async gotoCreateTraining() {
        await this.page.goto(
            `${process.env.NIPRO_BASE_URL}/node/add/imep_trainings`
        );

        await expect(this.trainingTitle).toBeVisible({
            timeout: 30000
        });
    }

    async fillTimeSlot(slotIndex, date, startTime, endTime) {
        const slot = this.timeSlotRows.nth(slotIndex);

        await expect(slot).toBeVisible();

        await slot.locator('input[type="date"]').first().fill(date);
        await slot.locator('input[type="time"]').first().fill(startTime);
        await slot.locator('input[type="time"]').nth(1).fill(endTime);

        await slot.getByRole('combobox', {
            name: 'Duration'
        }).selectOption({
            label: '1 hour'
        });

        await slot.getByRole('combobox', {
            name: 'Time zone'
        }).selectOption({
            label: 'UTC+5:30 (Asia/Kolkata)'
        });
    }

    async addSecondTimeSlot() {
        await this.addTimeSlotButton.click();

        const secondDate = this.page.getByRole('textbox', {
           name: 'Date *'
        }).nth(1);

        const secondStartTime = this.page.getByRole('textbox', {
           name: 'Time *'
        }).nth(1);

         const secondEndTime = this.page.getByRole('textbox', {
           name: 'Time *'
        }).nth(2);

        await expect(secondDate).toBeVisible({
            timeout: 10000
        });

        await secondDate.fill('2026-09-19');
        await secondStartTime.fill('20:29');
        await secondEndTime.fill('21:29');

        await this.page.getByRole('combobox', {
           name: 'Duration'
        }).nth(1).selectOption({
            label: '1 hour'
        });

        await this.page.getByRole('combobox', {
           name: 'Time zone'
        }).nth(1).selectOption({
           label: 'UTC+5:30 (Asia/Kolkata)'
       });
    }

    async fillMandatoryFields() {
        await this.trainingTitle.fill(
            'Automation IMEP Training'
        );

        await this.trainingType.selectOption({
            label: 'In person training'
        });

        await this.fillTimeSlot(
            0,
            '2026-09-15',
            '10:00',
            '11:00'
        );

        await this.addSecondTimeSlot();

        await this.durationDays.fill('0');
        await this.durationHours.fill('1');
        await this.durationMinutes.fill('0');

        const firstCountry = this.domainCountry.nth(0);

        await expect(firstCountry).toBeVisible();

        await firstCountry.fill('Global');

        await expect(
            this.page.getByText('Global', {
                exact: true
            }).last()
        ).toBeVisible();

        await this.page.getByText('Global', {
            exact: true
        }).last().click();

        await expect(firstCountry).toHaveValue(/Global/);

        await this.addCountryButton.click();

        await expect(this.domainCountry).toHaveCount(2, {
            timeout: 10000
        });

        const secondCountry = this.domainCountry.nth(1);

        await secondCountry.fill('India');

        await expect(
            this.page.getByText('India', {
                exact: true
            }).last()
        ).toBeVisible();

        await this.page.getByText('India', {
            exact: true
        }).last().click();

        await expect(secondCountry).toHaveValue(/India/);

        await this.trainingLevel.selectOption({
            label: 'Expert level'
        });

        await this.imepCategory.selectOption({
            label: 'Scientific'
        });

        await this.totalSlots.fill('10');

        await expect(this.totalSlots).toHaveValue('10');

        await this.trainingLanguage.selectOption({
            label: 'English'
        });
    }


    async publishAndSave() {
        await this.moderationState.selectOption({
            label: 'Published'
        });

        await this.saveButton.click();

        await this.page.waitForLoadState('domcontentloaded');
    }
}
