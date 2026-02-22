import Image from "@/components/Image";
import Icon from "@/components/Icon";
import type { ChatAttachment } from "@/types/chat-attachment";

type FilesProps = {
    image?: string;
    document?: string;
    attachments?: ChatAttachment[];
    onRemoveAttachment?: (attachmentId: string) => void;
};

function formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }

    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

const Files = ({ image, document, attachments, onRemoveAttachment }: FilesProps) => {
    const normalizedAttachments =
        attachments && attachments.length > 0
            ? attachments
            : document
              ? [
                    {
                        id: document,
                        name: document,
                        mediaType: "application/octet-stream",
                        size: 0,
                    },
                ]
              : [];

    return (
        <div className="p-4 border-b-2 border-n-3 dark:border-n-5 space-y-3">
            {normalizedAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {normalizedAttachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="relative flex w-fit max-w-[16rem] items-center gap-2 rounded-xl bg-n-2 px-2.5 py-2 pr-7 dark:bg-n-5/50"
                        >
                            <div className="w-7 shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="32"
                                    fill="none"
                                    viewBox="0 0 42 48"
                                >
                                    <path
                                        className="stroke-[#D9D9D9] dark:stroke-n-5"
                                        d="M36 47H6a5 5 0 0 1-5-5V6a5 5 0 0 1 5-5h20.721a5 5 0 0 1 3.402 1.336l9.279 8.616A5 5 0 0 1 41 14.616V42a5 5 0 0 1-5 5z"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M22.991 14.124a1 1 0 0 0-1.761-.764l-8.929 10.715-.424.537c-.108.156-.304.462-.31.865a1.5 1.5 0 0 0 .557 1.189c.313.253.674.298.863.315.199.018.444.018.684.018h6.195l-.86 6.876a1 1 0 0 0 1.761.764l8.93-10.715.424-.537c.108-.156.304-.462.31-.865a1.5 1.5 0 0 0-.557-1.189c-.313-.253-.674-.298-.863-.315a8.14 8.14 0 0 0-.685-.018h-6.195l.86-6.876z"
                                        fill="#8e55ea"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="base2 font-semibold truncate">{attachment.name}</div>
                                <div className="caption2 text-n-4">
                                    {formatFileSize(attachment.size)}
                                </div>
                            </div>
                            {onRemoveAttachment && (
                                <button
                                    className="group absolute right-1.5 top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-n-1 transition-colors hover:bg-accent-1 dark:bg-n-6"
                                    type="button"
                                    onClick={() => onRemoveAttachment(attachment.id)}
                                    aria-label={`Remove ${attachment.name}`}
                                >
                                    <Icon
                                        className="h-2.5 w-2.5 fill-n-4 transition-colors group-hover:fill-n-1"
                                        name="close"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {image && (
                <div className="relative w-[11.25rem] h-[11.25rem]">
                    <Image
                        className="rounded-xl object-cover"
                        src={image}
                        fill
                        alt="Avatar"
                    />
                </div>
            )}
        </div>
    );
};

export default Files;
