import { useState } from "react";


export default function NavItem({ item, selected, onSelect }) {
    const [open, setOpen] = useState(false);
    const isSel = selected === item.label;

    function handleClick() {
        if (item.children) {
            setOpen(!open);
        } else {
            onSelect(item.slug ?? item.label);
        }
    }

    return (
        <div className="p-4">
            <div
                onClick={handleClick}
                className={`text-white flex items-center cursor-pointer px-3 py-2 ${
                    isSel ? "font-bold" : ""
                }`}
            >
                <span className="text-sm">{item.label}</span>
            </div>

            {item.children && open && (
                <div>
                    {item.children.map((child) => (
                        <div
                            key={child.label}
                            onClick={() => onSelect(child.slug ?? child.label)}
                            className="text-white cursor-pointer px-6 py-1 text-xs"
                        >
                            {child.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
