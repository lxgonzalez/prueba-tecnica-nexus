export interface Compra {
    id: string;
    fecha: string;
    total: number;
    estado: 'pendiente' | 'pagado';
    telefono: string;
    product_id: string;
    paypal_transaction_id?: string;
    user_email?: string;
    user_name?: string;
}


export interface UpdateCompraData {
    estado?: 'pendiente' | 'pagado' ;
    paypal_transaction_id?: string;
}