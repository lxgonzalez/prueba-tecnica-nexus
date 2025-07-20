import { useCallback } from "react";
import { useTwilio } from "./useTwilio";

interface PayPalFormData {
    phone: string;
    nombre: string;
    productos: string;
    precio: string;
}

interface UsePayPalProps {
    onPaymentSuccess?: (details: any) => void;
    onPaymentError?: (error: any) => void;
    resetForm?: () => void;
}

export function usePayPal(props: UsePayPalProps = {}) {
    const { onPaymentSuccess, onPaymentError, resetForm } = props;
    const { sendMessage } = useTwilio();

    const createOrder = useCallback((precio: string) => {
        return (_data: any, actions: any) => {
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

    const onApprove = useCallback(async (_data: any, actions: any, formData?: PayPalFormData) => {
        try {
            const details = await actions.order!.capture();
            
            console.log("Detalles de la transacción:", details);
            
            // Enviar mensaje de confirmación si tenemos los datos del formulario
            if (formData && formData.phone && formData.nombre && formData.productos && formData.precio) {
                try {
                    const messageResult = await sendMessage(
                        formData.phone, 
                        formData.nombre, 
                        formData.productos, 
                        formData.precio
                    );
                    
                    if (messageResult.success) {
                        alert(`¡Pago completado! Se ha enviado un mensaje de confirmación a ${formData.phone}`);
                    } else {
                        alert("Pago completado, pero hubo un error enviando el mensaje de confirmación.");
                        console.error("Error enviando mensaje:", messageResult.error);
                    }
                } catch (messageError) {
                    console.error("Error enviando mensaje de confirmación:", messageError);
                    alert("Pago completado, pero hubo un error enviando el mensaje de confirmación.");
                }
            } else {
                alert("¡Pago completado exitosamente!");
            }

            // Limpiar formulario después del pago exitoso
            if (resetForm) {
                resetForm();
            }

            // Callback personalizado para el éxito del pago
            if (onPaymentSuccess) {
                onPaymentSuccess(details);
            }

            return details;
        } catch (error) {
            console.error("Error procesando el pago:", error);
            alert("Error al procesar el pago. Por favor, intenta nuevamente.");
            
            if (onPaymentError) {
                onPaymentError(error);
            }
            
            throw error;
        }
    }, [sendMessage, resetForm, onPaymentSuccess, onPaymentError]);

    const onError = useCallback((err: any) => {
        console.error("Error en PayPal:", err);
        alert("Error al procesar el pago. Intenta nuevamente.");
        
        if (onPaymentError) {
            onPaymentError(err);
        }
    }, [onPaymentError]);

    return {
        createOrder,
        onApprove,
        onError,
    };
}