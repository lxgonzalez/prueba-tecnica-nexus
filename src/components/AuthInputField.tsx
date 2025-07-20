interface AuthInputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AuthInputField({
    label,
    name,
    type = "text",
    value,
    error,
    onChange
}: AuthInputFieldProps) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${error
                        ? 'border-error focus:ring-error focus:border-error bg-error/5'
                        : 'border-muted focus:ring-primary focus:border-primary bg-white'
                    }`}
                placeholder={`Ingresa tu ${label.toLowerCase()}`}
            />
            {error && (
                <p className="mt-1 text-sm text-error bg-error/10 px-2 py-1 rounded">
                    {error}
                </p>
            )}
        </div>
    );
}