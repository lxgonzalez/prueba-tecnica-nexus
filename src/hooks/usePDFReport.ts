import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Compra } from '../types/Compra';

export function usePDFReport() {
    const generateSingleReport = (compra: Compra) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Reporte de Compra Individual', 14, 20);

        doc.setFontSize(12);
        doc.text(`ID: ${compra.id}`, 14, 35);
        doc.text(`Cliente: ${compra.user_name || 'Cliente'}`, 14, 45);
        doc.text(`Producto: Producto`, 14, 55);
        doc.text(`Total: $${compra.total}`, 14, 65);
        doc.text(`Estado: ${compra.estado}`, 14, 75);
        doc.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString('es-ES')}`, 14, 85);
        doc.text(`Teléfono: ${compra.telefono}`, 14, 95);

        if (compra.paypal_transaction_id) {
            doc.text(`ID PayPal: ${compra.paypal_transaction_id}`, 14, 105);
        }

        doc.save(`compra-${compra.id.slice(0, 8)}.pdf`);
    };

    const generateAllReport = (compras: Compra[]) => {
        const doc = new jsPDF();
        doc.text("Reporte de Compras", 14, 15);

        const rows = compras.map((compra) => [
            compra.user_name || 'Cliente',
            compra.telefono,
            'Producto',
            compra.total,
            compra.estado,
            new Date(compra.fecha).toLocaleDateString('es-ES'),
            compra.paypal_transaction_id || '-'
        ]);

        autoTable(doc, {
            head: [['Cliente', 'Teléfono', 'Producto', 'Total', 'Estado', 'Fecha', 'ID Paypal']],
            body: rows,
            startY: 20,
        });

        doc.save('reporte-compras.pdf');
    };

    return {
        generateSingleReport,
        generateAllReport
    };
}
