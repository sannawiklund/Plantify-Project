const { test, expect } = require('@playwright/test');

//Add
test('Add a new plant to "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    expect(newNote).toBeTruthy();
});

//Remove
test('Add and remove plant from My Plants list', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[id=plant-display-text]', 'Monstera');
    await page.click('button:has-text("Search")');
    await page.click('button:has-text("Add to my plants")');

    await page.waitForTimeout(1000);

    await page.click('button:has-text("Remove Plant")');

    await page.waitForTimeout(1000);

    const isPlantRemoved = !(await page.isVisible('h3:has-text("Monstera")'));
    expect(isPlantRemoved).toBe(true);
});

//Water
test('Water a plant in "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    expect(newNote).toBeTruthy();
});