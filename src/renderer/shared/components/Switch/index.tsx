import { Switch as RadixSwitch } from "@/components/ui/switch";

type SwitchProps = {
    className?: string;
    value: boolean;
    setValue: (value: boolean) => void;
};

const Switch = ({ className, value, setValue }: SwitchProps) => (
    <div className={`inline-flex shrink-0 ${className}`}>
        <RadixSwitch
            checked={value}
            onCheckedChange={setValue}
        />
    </div>
);

export default Switch;
