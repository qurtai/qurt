import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/utils/icons";

type ActionsProps = {
    className: string;
};

const Actions = ({ className }: ActionsProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const menu = [
        {
            id: "0",
            title: "Make admin",
            icon: "star",
            onClick: () => console.log("Make admin"),
        },
        {
            id: "1",
            title: "Delete member",
            icon: "trash",
            onClick: () => console.log("Delete member"),
        },
    ];

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="group relative w-6 h-8 py-1 data-[state=open]:[&_svg]:stroke-primary-1"
                    >
                        <Icon
                            className="stroke-n-4/50 rotate-90 transition-colors group-hover:stroke-n-7 dark:group-hover:stroke-n-3"
                            name="dots"
                        />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-[13.75rem] p-3"
                >
                    {menu.map((item, index) => (
                        <DropdownMenuItem
                            key={index}
                            className="h-10 px-3 rounded-lg base2 font-semibold cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault();
                                item.onClick();
                            }}
                        >
                            <Icon
                                className="shrink-0 size-5 mr-3 stroke-n-4"
                                name={item.icon}
                            />
                            {item.title}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Actions;
