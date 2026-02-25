import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RadioProps = {
    className?: string;
    content: string;
    value: boolean;
    onChange: (value: boolean) => void;
    name: string;
};

const Radio = ({ className, content, value, name, onChange }: RadioProps) => (
    <label
        className={`group relative flex items-center select-none cursor-pointer tap-highlight-color ${className ?? ""}`}
    >
        <RadioGroup
            value={value ? name : ""}
            onValueChange={(v) => v === name && onChange(true)}
            name={name}
        >
            <RadioGroupItem value={name} id={`${name}-radio`} />
        </RadioGroup>
        <span
            className={`base2 font-semibold text-n-4 transition-colors ml-3 group-hover:text-n-7 dark:group-hover:text-n-1 ${
                value ? "text-n-7 dark:text-n-1" : ""
            }`}
        >
            {content}
        </span>
    </label>
);

export default Radio;
