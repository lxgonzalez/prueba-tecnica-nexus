import { useCallback, useRef } from "react";
import { useTwilio } from "./useTwilio";

interface PayPalFormData {
    phone: string;
    nombre: string;
    product_id: string;
    product_nombre: string;
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

    const currentCompraId = useRef<string | null>(null);


    const createOrder = useCallback(
        (precio: string, formData: PayPalFormData | undefined, createCompra: Function) => {
            return async (_data: any, actions: any) => {
                try {
                    const compraData = {
                        fecha: new Date().toISOString(),
                        total: Number(precio),
                        estado: "pendiente",
                        telefono: formData?.phone ?? "",
                        product_id: formData?.product_id ?? "",
                        user_name: formData?.nombre ?? "",
                    };
                    const compraCreada = await createCompra(compraData);
                    currentCompraId.current = compraCreada.id;

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
                } catch (error) {
                    console.error("Error al crear la compra antes de la orden PayPal", error);
                    currentCompraId.current = null;
                    throw error;
                }
            };
        },
        []
    );


    const onApprove = useCallback(async (_data: any, actions: any, formData?: PayPalFormData, markAsPaid?: Function) => {
        try {
            const details = await actions.order!.capture();

            console.log("Detalles de la transacción:", details);
            const paypalTransactionId = details.id || details.purchase_units?.[0]?.payments?.captures?.[0]?.id;
            if (currentCompraId.current && markAsPaid && paypalTransactionId) {
                try {
                    const updateResult = await markAsPaid(currentCompraId.current, paypalTransactionId);

                    if (updateResult) {
                        console.log('Compra actualizada exitosamente a estado "pagado"');
                    } else {
                        console.warn('No se pudo actualizar el estado de la compra');
                    }
                } catch (updateError) {
                    console.error('Error actualizando estado de compra:', updateError);
                    // No lanzamos el error porque el pago ya se procesó
                }
            } else {
                console.warn('Faltan datos para actualizar compra:', {
                    compraId: currentCompraId.current,
                    markAsPaid: !!markAsPaid,
                    paypalTransactionId
                });
            }

            // if (formData && formData.phone && formData.nombre && formData.product_id && formData.product_nombre && formData.precio) {
            //     try {
            //         const messageResult = await sendMessage(
            //             formData.phone,
            //             formData.nombre,
            //             formData.product_nombre,
            //             formData.precio
            //         );

            //         if (messageResult.success) {
            //             alert(`¡Pago completado! Se ha enviado un mensaje de confirmación a ${formData.phone}`);
            //         } else {
            //             alert("Pago completado, pero hubo un error enviando el mensaje de confirmación.");
            //             console.error("Error enviando mensaje:", messageResult.error);
            //         }
            //     } catch (messageError) {
            //         console.error("Error enviando mensaje de confirmación:", messageError);
            //         alert("Pago completado, pero hubo un error enviando el mensaje de confirmación.");
            //     }
            // } else {
            //     alert("¡Pago completado exitosamente!");
            // }

            if (resetForm) {
                resetForm();
            }

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