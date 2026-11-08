import { test } from "@playwright/test";
import { LoginPage } from "../Pages/LoginPage";
import { CartPage } from "../Pages/CartPage";
import { Dashboard } from "../Pages/Dashboard";

const email = process.env.EMAIL ?? "";
const password = process.env.PASSWORD ?? "";

const ProductName1 = "ZARA COAT 3";
const ProductName2 = "ADIDAS ORIGINAL";
const ProductName3 = "iphone 13 pro";
const InvalidProduct = "INVALID PRODUCT XYZ";

test.describe("Dashboard", { tag: "@SmokeLogin" }, () => {
  test.describe.configure({ mode: "parallel" });

  test("invalid login should stay on login page", async ({ page }) => {
    const logObj = new LoginPage(page);
    await logObj.invalidLogin("wrong@email.com", "WrongPass123");
  });

  

  test.describe("Dashboard", { tag: "@SmokeDashboard" }, () => {
    test.beforeEach(async ({ page }) => {
      if (!email || !password) {
        throw new Error("SET EMAIL AND PASSWORD inside the .env file");
      }

      const logObj = new LoginPage(page);
      await logObj.validLogin(email, password);
    });

    test.afterEach(async ({ page }) => {
      const logObj = new LoginPage(page);
      await logObj.logout();
    });

    test("list ZARA COAT 3 in dashboard", async ({ page }) => {
      const dashboardObj = new Dashboard(page);
      await dashboardObj.expectProduct(ProductName1);
    });

    test("list ADIDAS ORIGINAL in dashboard", async ({ page }) => {
      const dashboardObj = new Dashboard(page);
      await dashboardObj.expectProduct(ProductName2);
    });

    test("list iphone 13 pro in dashboard", async ({ page }) => {
      const dashboardObj = new Dashboard(page);
      await dashboardObj.expectProduct(ProductName3);
    });
  });
});

test.describe("Cart", { tag: "@regression" }, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    if (!email || !password) {
      throw new Error("SET EMAIL AND PASSWORD inside the .env file");
    }

    const logObj = new LoginPage(page);
    await logObj.validLogin(email, password);
  });

  test.afterEach(async ({ page }) => {
    const logObj = new LoginPage(page);
    await logObj.logout();
  });

  test("cannot add a product that does not exist", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.expectCannotAddProduct(InvalidProduct);
  });

  test("Add ZARA COAT 3 to cart", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.addProduct(ProductName1);
  });

  test("show zara coat 3 in cart", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.openCart();
    const cartObj = new CartPage(page);
    await cartObj.expectAddedProduct(ProductName1);
  });

  test("remove zara coat 3 from cart", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    const cartObj = new CartPage(page);
    await dashboardObj.addProduct(ProductName1);
    await dashboardObj.openCart();
    await cartObj.expectAddedProduct(ProductName1);
    await cartObj.removeProductFromCart(ProductName1);
  });

  test.afterAll(async ({ browser }) => {
    const page = await browser.newPage();

    const logObj = new LoginPage(page);
    const cartObj = new CartPage(page);
    const dashboardObj = new Dashboard(page);

    await logObj.validLogin(email, password);
    await dashboardObj.openCart();
    await cartObj.removeProductFromCart(ProductName1);

    await page.close();
  });
});
