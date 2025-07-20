export interface TwilioConfig {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
}

export interface TwilioApiResponse {
    sid: string;
    status: string;
    error_message?: string;
}

export class TwilioClient {
    private config: TwilioConfig;

    constructor(config: TwilioConfig) {
        this.config = config;
        if (!config.accountSid || !config.authToken || !config.phoneNumber) {
            throw new Error('Faltan datos de configuración de Twilio');
        }
    }

    private formatPhoneNumber(phone: string): string {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('09')) {
            cleaned = '+593' + cleaned.slice(1);
        } else if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return `whatsapp:${cleaned}`;
    }

    async sendMessage(to: string, message: string): Promise<TwilioApiResponse> {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`;
        const body = new URLSearchParams({
            To: this.formatPhoneNumber(to),
            From: this.config.phoneNumber,
            Body: message,
        });

        const headers = {
            'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: body.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_message || 'Error al enviar mensaje con Twilio');
        }

        return data;
    }
}

export const createTwilioClient = (): TwilioClient => {
    const config: TwilioConfig = {
        accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
        authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
        phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
    };
    return new TwilioClient(config);
};

export const twilioClient = createTwilioClient();
