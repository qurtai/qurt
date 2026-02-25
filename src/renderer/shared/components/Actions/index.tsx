import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/utils/icons";

type ActionsProps = {
    className?: string;
    classButton: string;
    classTitle?: string;
    buttonInner: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const Actions = ({
    className,
    classButton,
    classTitle,
    buttonInner,
    title,
    children,
}: ActionsProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative z-3 ${className}`}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                    className={`${classButton} btn-small`}
                    asChild
                >
                    <button type="button">{buttonInner}</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="absolute -left-2 bottom-11 w-[19.5rem] p-4"
                    side="top"
                    align="start"
                    sideOffset={0}
                >
                    <div className="flex justify-between items-center mb-3">
                        <div className={`base1 ${classTitle ?? ""}`}>
                            {title}
                        </div>
                        <button
                            type="button"
                            className="group w-8 h-8 text-0"
                            onClick={() => setOpen(false)}
                        >
                            <Icon
                                className="stroke-n-4 transition-colors group-hover:stroke-accent-1"
                                name="close"
                            />
                        </button>
                    </div>
                    {children}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Actions;
