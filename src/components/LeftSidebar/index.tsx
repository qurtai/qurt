import { useState, useEffect, useCallback } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Search from "@/components/Search";
import Settings from "@/components/Settings";
import Navigation from "./Navigation";
import ChatList from "./ChatList";
import ToggleTheme from "./ToggleTheme";

import { settings } from "@/constants/settings";
import { twMerge } from "tailwind-merge";
import {
    CHAT_LISTS_UPDATED_EVENT,
    chatListService,
} from "@/services/chat-list-service";
import {
    CHAT_HISTORY_UPDATED_EVENT,
    chatService,
} from "@/services/chat-service";

type LeftSidebarProps = {
    value: boolean;
    setValue?: any;
    smallSidebar?: boolean;
    visibleRightSidebar?: boolean;
};

const LeftSidebar = ({
    value,
    setValue,
    smallSidebar,
    visibleRightSidebar,
}: LeftSidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [visibleSearch, setVisibleSearch] = useState<boolean>(false);
    const [visibleSettings, setVisibleSettings] = useState<boolean>(false);
    const [chatListItems, setChatListItems] = useState<
        {
            id: string;
            title: string;
            counter: number;
            color: string;
        }[]
    >([]);

    const activeListId =
        new URLSearchParams(location.search).get("list")?.trim() || "";

    useEffect(() => {
        window.addEventListener("keydown", handleWindowKeyDown);
        return () => {
            window.removeEventListener("keydown", handleWindowKeyDown);
        };
    }, []);

    const loadChatLists = useCallback(async () => {
        const [lists, counts] = await Promise.all([
            chatListService.listChatLists(),
            chatService.listChatCountsByList(),
        ]);

        setChatListItems(
            lists.map((list) => ({
                id: list.id,
                title: list.title,
                color: list.color,
                counter: counts[list.id] ?? 0,
            }))
        );
    }, []);

    useEffect(() => {
        const handleListsUpdated = () => {
            void loadChatLists();
        };

        void loadChatLists();
        window.addEventListener(CHAT_LISTS_UPDATED_EVENT, handleListsUpdated);
        window.addEventListener(CHAT_HISTORY_UPDATED_EVENT, handleListsUpdated);

        return () => {
            window.removeEventListener(
                CHAT_LISTS_UPDATED_EVENT,
                handleListsUpdated
            );
            window.removeEventListener(
                CHAT_HISTORY_UPDATED_EVENT,
                handleListsUpdated
            );
        };
    }, [loadChatLists]);

    const handleWindowKeyDown = (event: any) => {
        if (event.metaKey && event.key === "f") {
            event.preventDefault();
            setVisibleSearch(true);
        }
    };

    const chatsNavigation = [
        {
            title: "Chats",
            icon: "chat",
            color: "fill-accent-2",
            url: "/",
        },
    ];

    const navigation = [
        {
            title: "Search",
            icon: "search",
            color: "fill-primary-2",
            onClick: () => setVisibleSearch(true),
        },
        {
            title: "Updates & FAQ",
            icon: "barcode",
            color: "fill-accent-1",
            url: "/updates-and-faq",
        },
        {
            title: "Settings",
            icon: "settings",
            color: "fill-accent-3",
            onClick: () => setVisibleSettings(true),
        },
    ];

    const handleClick = () => {
        setValue(!value);
        smallSidebar && value ? disablePageScroll() : enablePageScroll();
    };

    const handleSelectChatList = (listId: string) => {
        const listQuery = `?list=${encodeURIComponent(listId)}`;
        navigate(`/${listQuery}`);
    };

    return (
        <>
            <div
                className={twMerge(
                    `fixed z-20 top-0 left-0 bottom-0 flex flex-col pt-30 px-4 bg-n-7 md:invisible md:opacity-0 md:transition-opacity ${
                        value
                            ? "w-24 pb-38 md:w-16 md:px-0 md:pb-30"
                            : "w-80 pb-58"
                    } ${visibleRightSidebar && "md:visible md:opacity-100"}`
                )}
            >
                <div
                    className={`absolute top-0 right-0 left-0 flex items-center h-30 pl-7 pr-6 ${
                        value ? "justify-center md:px-4" : "justify-between"
                    }`}
                >
                    {!value && <Logo />}
                    <button
                        className="group tap-highlight-color"
                        onClick={handleClick}
                    >
                        <Icon
                            className="fill-n-4 transition-colors group-hover:fill-n-3"
                            name={value ? "toggle-on" : "toggle-off"}
                        />
                    </button>
                </div>
                <div className="grow overflow-y-auto scroll-smooth scrollbar-none">
                    <Navigation visible={value} items={chatsNavigation} />
                    <ChatList
                        visible={value}
                        items={chatListItems}
                        activeListId={activeListId}
                        onSelectList={handleSelectChatList}
                        onCreateList={async (input) => {
                            await chatListService.createChatList(input);
                            await loadChatLists();
                        }}
                    />
                    <div
                        className={`my-4 h-0.25 bg-n-6 ${
                            value ? "-mx-4 md:mx-0" : "-mx-2 md:mx-0"
                        }`}
                    ></div>
                    <Navigation visible={value} items={navigation} />
                </div>
                <div className="absolute left-0 bottom-0 right-0 pb-6 px-4 bg-n-7 before:absolute before:left-0 before:right-0 before:bottom-full before:h-10 before:bg-gradient-to-t before:from-[#131617] before:to-[rgba(19,22,23,0)] before:pointer-events-none md:px-3">
                    <ToggleTheme visible={value} />
                </div>
            </div>
            <Modal
                className="md:!p-0"
                classWrap="md:min-h-screen-ios md:rounded-none dark:shadow-[inset_0_0_0_0.0625rem_#232627,0_2rem_4rem_-1rem_rgba(0,0,0,0.33)] dark:md:shadow-none"
                classButtonClose="hidden md:flex md:absolute md:top-6 md:left-6 dark:fill-n-1"
                classOverlay="md:bg-n-1"
                visible={visibleSearch}
                onClose={() => setVisibleSearch(false)}
            >
                <Search />
            </Modal>
            <Modal
                className="md:!p-0"
                classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
                classButtonClose="hidden md:block md:absolute md:top-5 md:right-5 dark:fill-n-4"
                classOverlay="md:bg-n-1"
                visible={visibleSettings}
                onClose={() => setVisibleSettings(false)}
            >
                <Settings items={settings} />
            </Modal>
        </>
    );
};

export default LeftSidebar;
