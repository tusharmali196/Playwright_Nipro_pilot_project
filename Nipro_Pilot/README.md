# NIPRO Playwright Pilot Project

## Overview
Playwright automation framework created for NIPRO Pilot project.

## Tech Stack
- Playwright
- JavaScript

## Project Structure

Nipro_Pilot/
├── pages/
│   ├── 
│
├── tests/
│   ├── 
│
├── playwright.config.js
├── package.json
└── .env.example

## Automated Scenarios

### Admin
- Admin login
- User search
- User filtering
- Password update
- User status update

### Landing Page
- Landing page creation
- Landing page layout validation

### Registration
- Registration form validation
- Registration flow

### Global Search
- Search functionality
- Search result validation
- Type filtering
- Invalid search scenario

## Running Tests

npm install

npx playwright install

npx playwright test

## Run a specific test

npx playwright test tests/nipro-search.spec.js

## Run with UI

npx playwright test --ui

## Environment

Copy `.env.example` to `.env.pilot` and provide the required environment values.

Sensitive credentials are not committed to the repository.
