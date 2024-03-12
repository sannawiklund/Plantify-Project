const { test, expect } = require('@playwright/test');

//Add
test('Add a new plant to "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    let searchInput = page.locator('#plant-display-text');
    await searchInput.fill('aloe');
    await searchInput.press('Enter');
    await expect(page.getByText('Aloe Vera')).toBeVisible();

    let aloeVeraElement = await page.waitForSelector('li:has-text("Aloe Vera")');
    expect(aloeVeraElement).toBeTruthy();

    await page.click('button:has-text("Add to my plants")');

    let addedPlant = await page.waitForSelector('li:has-text("Aloe Vera")');
    await expect(addedPlant).toBeTruthy();

});

//Remove
test('Add and remove plant from My Plants list', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[id=plant-display-text]', 'Monstera');
    await page.click('button:has-text("Search")');
    await page.click('button:has-text("Add to my plants")');

    await page.click('button:has-text("Remove Plant")');

    const isPlantRemoved = !(await page.isVisible('h3:has-text("Monstera")'));
    expect(isPlantRemoved).toBe(true);
});

//Water
test('Add and water a plant in "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    await page.fill('input[id=plant-display-text]', 'Ficus');
    await page.click('button:has-text("Search")');
    await page.click('button:has-text("Add to my plants")');

    await page.click('button:has-text("Water me please! 💧")');

    const wateredPlant = await page.isVisible('button:has-text("All good! 😊")');

    expect(wateredPlant).toBe(true);
});

//Show information 
test('Show information for a plant in "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    await page.fill('input[id=plant-display-text]', 'Peace Lily');
    await page.click('button:has-text("Search")');
    await page.click('button:has-text("Add to my plants")');

    await page.click('button:has-text("Show plant information")');

    const plantInfo = await page.waitForSelector('p:has-text("Last watered")'); //Shows the last element in the information-list.

    await expect(plantInfo).toBeTruthy();

});

//Filter watered plants
test('Filter watered plants', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    await page.fill('input[id=plant-display-text]', 'Snake Plant');
    await page.click('button:has-text("Search")');
    await page.click('button:has-text("Add to my plants")');

    await page.click('button:has-text("Water me please! 💧")');

    const wateredPlant = await page.isVisible('button:has-text("All good! 😊")');

    await page.getByLabel('Watered').check();

    const waterFilter = await page.waitForSelector('li:has-text("Snake Plant")');

    await expect(waterFilter).toBeTruthy();

});