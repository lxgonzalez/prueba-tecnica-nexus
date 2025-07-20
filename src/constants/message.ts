export const MessageTemplate = (customerName: string, productName: string, price: string) => {
    return (
`¡Hola ${customerName}! 🎉
Tu compra ha sido confirmada exitosamente:
📦 *Producto:* ${productName}
💰 *Precio:* $${price} USD
✅ *Estado:* Confirmado
Gracias por confiar en *Nexus Soluciones*.
📞 *Contacto:* 099 056 7275
🌐 *Web:* www.solucionesnexus.com`
    )
}
