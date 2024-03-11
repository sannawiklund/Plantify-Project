const { test, expect } = require('@playwright/test');

//Add
test('Add a new plant to "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    expect(newNote).toBeTruthy();
});

//Remove
test('Remove a plant from "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    expect(newNote).toBeTruthy();
});

//Water
test('Water a plant in "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    expect(newNote).toBeTruthy();
});