import { Checkbox as RadixCheckbox } from "@/components/ui/checkbox";

type CheckboxProps = {
    className?: string;
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
    reverse?: boolean;
};

const Checkbox = ({
    className,
    label,
    value,
    onChange,
    reverse,
}: CheckboxProps) => (
    <label
        className={`group relative flex items-start select-none cursor-pointer tap-highlight-color ${
            reverse ? "flex-row-reverse" : ""
        } ${className ?? ""}`}
    >
        <RadixCheckbox
            checked={value}
            onCheckedChange={(checked) => onChange(checked === true)}
        />
        {label && (
            <span
                className={`base2 text-n-6 dark:text-n-3 ${
                    reverse ? "mr-auto pr-3" : "pl-3"
                }`}
            >
                {label}
            </span>
        )}
    </label>
);

export default Checkbox;
