/**
 * Checkout Components
 * 
 * Modular components for the checkout flow, extracted from a single large page
 * for better maintainability and reusability.
 */

export { default as CheckoutShippingForm, type ShippingFormData } from './CheckoutShippingForm';
export { default as CheckoutPaymentMethod, type PaymentMethod } from './CheckoutPaymentMethod';
export { default as CheckoutOrderSummary } from './CheckoutOrderSummary';
