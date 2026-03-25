import type { Page } from '@playwright/test';

/** Pasos de checkout: información del cliente, resumen y confirmación. */
export class CheckoutPage {
  constructor(private readonly page: Page) {}

  /** Paso "Your information": nombre, apellido, código postal y Continuar. */
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
  }

  /** En el resumen del pedido, confirma la compra. */
  async finishOrder(): Promise<void> {
    await this.page.locator('[data-test="finish"]').click();
  }

  /** Espera el mensaje final de pedido completado. */
  async expectOrderComplete(): Promise<void> {
    await this.page.getByText(/thank you for your order/i).waitFor({ state: 'visible' });
  }
}
