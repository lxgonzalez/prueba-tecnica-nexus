import { useEffect, useState } from 'react';
import { useCompra } from '../hooks/useCompra';
import { usePDFReport } from '../hooks/usePDFReport';
import type { Compra } from '../types/Compra';

interface FilterControlsProps {
    filtroEstado: 'todos' | 'pendiente' | 'pagado';
    setFiltroEstado: (estado: 'todos' | 'pendiente' | 'pagado') => void;
    comprasCount: number;
    onExportPDF: () => void;
}

function FilterControls({ filtroEstado, setFiltroEstado, comprasCount, onExportPDF }: FilterControlsProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'pendiente' | 'pagado')}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="todos">Todas las Compras</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="pagado">Pagados</option>
                </select>
                <span className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                    {comprasCount} compra{comprasCount !== 1 ? 's' : ''}
                </span>
            </div>
            <button
                onClick={onExportPDF}
                className="bg-primary/50 hover:bg-primary text-white px-4 py-2 rounded-lg transition"
            >
                Descargar reporte
            </button>
        </div>
    );
}

interface CompraCardProps {
    compra: Compra;
}

function CompraCard({ compra }: CompraCardProps) {
    return (
        <div className="bg-white/80 py-5 px-10 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-medium text-gray-900">
                        {(compra as any).productos?.title || 'Producto'}
                    </h3>
                    <p className="text-sm text-gray-500">{compra.user_name}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">${compra.total}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${compra.estado === 'pagado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {compra.estado}
                    </span>
                </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Teléfono:</strong> {compra.telefono}</p>
                {compra.paypal_transaction_id && (
                    <p className="font-mono"><strong>ID Paypal:</strong> {compra.paypal_transaction_id}</p>
                )}
            </div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex justify-center p-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
    );
}

function ErrorMessage({ error }: { error: string }) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>;
}

function EmptyState() {
    return <div className="text-center text-gray-500 p-8">No hay compras registradas</div>;
}

export function ComprasList() {
    const { compras, getAllCompras, loading, error } = useCompra();
    const { generateAllReport } = usePDFReport();
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'pagado'>('todos');

    useEffect(() => {
        getAllCompras();
    }, [getAllCompras]);

    const comprasFiltradas = compras.filter(compra => {
        if (filtroEstado === 'todos') return true;
        return compra.estado === filtroEstado;
    });

    const exportPDF = () => {
        generateAllReport(comprasFiltradas);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    if (comprasFiltradas.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-4">
            <FilterControls
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                comprasCount={comprasFiltradas.length}
                onExportPDF={exportPDF}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {comprasFiltradas.map((compra) => (
                    <CompraCard key={compra.id} compra={compra} />
                ))}
            </div>
        </div>
    );
}
