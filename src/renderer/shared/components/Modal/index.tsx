import * as DialogPrimitive from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/utils/icons";

type ModalProps = {
    className?: string;
    classWrap?: string;
    classOverlay?: string;
    classButtonClose?: string;
    visible: boolean;
    onClose: () => void;
    initialFocus?: React.RefObject<HTMLDivElement | null>;
    children: React.ReactNode;
    video?: boolean;
};

const Modal = ({
    className,
    classWrap,
    classOverlay,
    classButtonClose,
    visible,
    onClose,
    children,
    video,
}: ModalProps) => {
    return (
        <DialogPrimitive.Root open={visible} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={twMerge(
                        "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        video ? "bg-n-7/95" : "bg-n-7/75 dark:bg-n-6/90",
                        classOverlay
                    )}
                    aria-hidden="true"
                />
                <DialogPrimitive.Content
                    className={twMerge(
                        "fixed inset-0 z-50 flex p-6 overflow-auto scroll-smooth md:px-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        !video && "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
                        className
                    )}
                    onEscapeKeyDown={onClose}
                    onPointerDownOutside={onClose}
                    onInteractOutside={onClose}
                >
                    <div
                        className={twMerge(
                            "relative z-10 max-w-[37.5rem] w-full m-auto bg-n-1 rounded-3xl dark:bg-n-7",
                            video &&
                                "static max-w-[64rem] aspect-video rounded-[1.25rem] bg-n-7 overflow-hidden shadow-[0_2.5rem_8rem_rgba(0,0,0,0.5)]",
                            classWrap
                        )}
                    >
                        {children}
                        <DialogPrimitive.Close
                            className={twMerge(
                                "text-0 fill-n-7 hover:fill-primary-1",
                                video && "absolute top-6 right-6 w-10 h-10 bg-n-1 rounded-full",
                                classButtonClose
                            )}
                        >
                            <Icon
                                className="stroke-current transition-colors"
                                name="close"
                            />
                        </DialogPrimitive.Close>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default Modal;
