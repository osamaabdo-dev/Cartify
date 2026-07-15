import { APP_CONFIG } from "@/lib/constants";

export function parsePrice(price) {
    const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
}
export function formatPrice(amount) {
    return `${Number(amount).toFixed(2)} ${APP_CONFIG.currency}`;
}
export function itemTotal(item) {
    return parsePrice(item.price) * item.quantity;
}