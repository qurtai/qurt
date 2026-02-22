import { useState } from "react";
import Field from "@/components/Field";
import Select from "@/components/Select";

const colors = [
    {
        id: "0",
        title: "Chinese Violet",
        color: "#8C6584",
    },
    {
        id: "1",
        title: "Dodger blue",
        color: "#3E90F0",
    },
    {
        id: "2",
        title: "Golden Gate Bridge",
        color: "#D84C10",
    },
    {
        id: "3",
        title: "Veronica",
        color: "#8E55EA",
    },
    {
        id: "4",
        title: "Sugus green",
        color: "#7ECE18",
    },
];

type AddChatListProps = {
    onCancel?: () => void;
    onAdd?: (input: {
        title: string;
        description?: string;
        color?: string;
    }) => Promise<void>;
};

const AddChatList = ({ onCancel, onAdd }: AddChatListProps) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [color, setColor] = useState<any>(colors[1]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleAdd = async () => {
        if (!onAdd || !name.trim() || isSaving) {
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            await onAdd({
                title: name.trim(),
                description: description.trim(),
                color: color?.color,
            });
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create chat list."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-12 lg:px-8 md:pt-6 md:px-5 md:pb-6">
            <div className="mb-8 h4">Add chat list</div>
            <div className="relative z-10 flex mb-8 md:block">
                <Field
                    className="grow mr-3 md:mr-0 md:mb-3"
                    label="Name"
                    placeholder="Name"
                    icon="chat-1"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                    required
                />
                <Select
                    label="Color"
                    className="shrink-0 min-w-[14.5rem]"
                    items={colors}
                    value={color}
                    onChange={setColor}
                />
            </div>
            <Field
                className="mb-8"
                label="Description"
                placeholder="What chats belong in this list?"
                icon="chat-1"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                textarea
            />
            <div className="flex justify-end">
                <button className="btn-stroke-light mr-3" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    className="btn-blue"
                    onClick={handleAdd}
                    disabled={!name.trim() || isSaving}
                >
                    {isSaving ? "Adding..." : "Add list"}
                </button>
            </div>
            {errorMessage && (
                <div className="mt-4 rounded-xl bg-accent-1/10 px-4 py-3 base2 text-accent-1">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default AddChatList;
