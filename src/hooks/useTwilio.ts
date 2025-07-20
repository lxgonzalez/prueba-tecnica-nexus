import { useState, useCallback } from 'react';
import { twilioClient } from '../service/twilioClient';
import { MessageTemplate } from '../constants/message';
import type { TwilioResponse } from '../types/twilio';

export function useTwilio() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(
        async (phone: string, customerName: string, productName: string, price: string): Promise<TwilioResponse> => {
            if (!phone || !customerName || !productName || !price) {
                const errMsg = 'Todos los campos son requeridos';
                setError(errMsg);
                return { success: false, error: errMsg };
            }

            setLoading(true);
            setError(null);

            try {
                const message = MessageTemplate(customerName, productName, price);
                const result = await twilioClient.sendMessage(phone, message);

                setLoading(false);
                return {
                    success: true,
                    messageSid: (result as any)?.sid,
                };
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setLoading(false);
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
        },
        []
    );

    return { loading, error, sendMessage };
}
