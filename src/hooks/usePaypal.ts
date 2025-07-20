import { useCallback } from "react";

export function usePayPal() {
    const createOrder = useCallback((precio: string) => {
        return (data: any, actions: any) => {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: precio,
                        },
                    },
                ],
            });
        };
    }, []);

    const onApprove = useCallback(async (data: any, actions: any) => {
        const details = await actions.order!.capture();
        if (details.payer && details.payer.name?.given_name) {
            alert(`Pago completado por ${details.payer.name.given_name}`);
        } else {
            alert("Pago completado.");
        }
        console.log("Detalles de la transacción:", details);
        return details;
    }, []);

    const onError = useCallback((err: any) => {
        console.error("Error en PayPal:", err);
        alert("Error al procesar el pago. Intenta nuevamente.");
    }, []);

    return {
        createOrder,
        onApprove,
        onError,
    };
}