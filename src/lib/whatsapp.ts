// WhatsApp utility functions

/**
 * Detects if user is on mobile device
 */
export function isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Generates WhatsApp chat URL
 * @param phoneNumber - WhatsApp number with country code (e.g., "919876543210")
 * @param message - Pre-filled message text
 * @returns WhatsApp URL
 */
export function getWhatsAppURL(phoneNumber: string, message?: string): string {
    const baseURL = isMobile() ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    const params = new URLSearchParams({
        phone: phoneNumber,
        ...(message && { text: message })
    });
    return `${baseURL}?${params.toString()}`;
}

/**
 * Pre-defined message templates
 */
export const whatsAppMessages = {
    general: 'Hi! I have a question about Vishwa Wellness.',
    product: 'Hi! I\'d like to know more about one of your products.',
    retreat: 'Hi! I\'m interested in learning more about Agnihotra Wellness Retreats.',
    consultation: 'Hi! I\'d like to schedule a wellness consultation.',
    custom: (message: string) => message
};
