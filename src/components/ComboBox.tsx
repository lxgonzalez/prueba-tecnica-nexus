import { useState } from "react";

type ComboBoxProps<T> = {
    label: React.ReactNode;
    name: string;
    data: T[];
    searchKey: keyof T;
    renderItem: (item: T) => React.ReactNode;
    onSelect?: (item: T) => void;
};

export function ComboBox<T>({
    label,
    name,
    data,
    searchKey,
    renderItem,
    onSelect,
}: ComboBoxProps<T>) {
    const [query, setQuery] = useState("");
    const [showList, setShowList] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowList(true);
    };

    const handleSelect = (item: T) => {
        setQuery(String(item[searchKey]));
        setShowList(false);
        onSelect?.(item);
    };

    const filteredData = data.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="relative mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type="search"
                value={query}
                onChange={handleChange}
                onFocus={() => setShowList(true)}
                onBlur={() => setTimeout(() => setShowList(false), 100)}
                className="w-full p-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 bg-white"
            />

            {showList && filteredData.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-muted rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
                    {filteredData.map((item, idx) => (
                        <li
                            key={idx}
                            onMouseDown={() => handleSelect(item)}
                            className="p-3 hover:bg-accent hover:text-gray-800 cursor-pointer transition-colors duration-150 border-b border-muted/30 last:border-b-0"
                        >
                            {renderItem(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
