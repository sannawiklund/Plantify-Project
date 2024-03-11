const { test, expect } = require('@playwright/test');

//Add
test('Add a new plant to "MyPlants"', async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');

    let searchInput = page.locator('#plant-display-text');
    await searchInput.fill('aloe');
    await seachInput.press('Enter');
    await expect(page.getByText('Aloe Vera')).toBeVisible();

    // Kolla så att sökresultatet är synligt
    let aloeVeraElement = await page.waitForSelector('.plant-list)'); //ev li:has-text("Aloe Vera")'
    expect(aloeVeraElement).toBeTruthy();

    await aloeVeraElement.click('button:has-text("Add to my plants")');

    // Verifiera att plantan har lagts till i "MyPlants"

    let addedPlant = await page.waitForSelector('.my-plants'); // ev 'li:has-text("Aloe Vera")'
    await expect(addedPlant).toBeVisible();

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