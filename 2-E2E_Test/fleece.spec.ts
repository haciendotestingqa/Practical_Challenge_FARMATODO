/**
 * E2E en Saucedemo: flujo completo de compra del producto "Sauce Labs Fleece Jacket".
 * Page Object Model: cada pantalla tiene su clase en ./pages/
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

const PRODUCT = 'Sauce Labs Fleece Jacket';
type CapturedProduct = { name: string; price: string };

/** Unifica espacios para comparar precios/títulos entre pantallas. */
function normalizePrice(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Imprime en terminal cada paso importante del flujo E2E. */
function logStep(step: string): void {
  console.log(`[E2E][PASO] ${step}`);
}

test.describe('Saucedemo Fleece', () => {
  test('login carrito checkout', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Entrada: login con usuario de demo
    logStep('Abrir la página de login');
    await login.goto();
    logStep('Iniciar sesión con usuario de prueba');
    await login.login('standard_user', 'secret_sauce');

    logStep('Validar que el inventario esté visible');
    await expect(page.locator('.inventory_list')).toBeVisible();

    // Inventario: primera lectura y almacenamiento explícito para validaciones futuras
    logStep(`Capturar nombre y precio del producto: ${PRODUCT}`);
    const fromListing = await inventory.getProductTitleAndPrice(PRODUCT);
    const capturedProduct: CapturedProduct = {
      name: fromListing.title,
      price: fromListing.price,
    };
    expect(capturedProduct.name).toBe(PRODUCT);

    logStep('Agregar producto al carrito');
    await inventory.addToCart(PRODUCT);
    logStep('Abrir carrito');
    await inventory.openCart();

    // Carrito: deben coincidir nombre y precio con lo capturado en el listado
    logStep('Validar nombre y precio del carrito contra lo capturado');
    const fromCart = await cart.getLineTitleAndPrice();
    expect(normalizePrice(fromCart.title)).toBe(normalizePrice(capturedProduct.name));
    expect(normalizePrice(fromCart.price)).toBe(normalizePrice(capturedProduct.price));

    // Checkout: datos del cliente → resumen → finalizar → pantalla de gracias
    logStep('Ir a checkout');
    await cart.checkout();
    logStep('Completar datos del cliente');
    await checkout.fillCustomerInfo('Veronica', 'Romero', '28001');
    logStep('Finalizar compra');
    await checkout.finishOrder();
    logStep('Validar confirmación de orden');
    await checkout.expectOrderComplete();
    logStep('Flujo E2E completado correctamente');
  });
});
