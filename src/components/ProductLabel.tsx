
interface ProductLabelProps {
    loading: boolean;
    error: boolean;
}

export function ProductLabel({ loading, error }: ProductLabelProps) {

    return (<div className="flex items-center gap-2">
        <span>Seleccionar producto</span>
        {loading && (
            <span className="text-xs text-info bg-info/10 px-2 py-0.5 rounded">
                Cargando...
            </span>
        )}
        {error && (
            <span className="text-xs text-error bg-error/10 px-2 py-0.5 rounded">
                Error
            </span>
        )}
    </div>
    );
}