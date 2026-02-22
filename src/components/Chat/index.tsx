import { useState } from "react";
import Icon from "@/components/Icon";
import ModelSelector from "@/components/ModelSelector";
import ModalShareChat from "@/components/ModalShareChat";
import Notifications from "@/components/RightSidebar/Notifications";
import { notifications } from "@/mocks/notifications";
import Actions from "./Actions";

type ChatProps = {
  chatId: string;
  chatListIds: string[];
  title: string;
  children: React.ReactNode;
  hideRightSidebar?: boolean;
  onToggleRightSidebar?: () => void;
};

const Chat = ({
  chatId,
  chatListIds,
  title,
  children,
  hideRightSidebar,
  onToggleRightSidebar,
}: ChatProps) => {
  const [favorite, setFavorite] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center min-h-[4.5rem] px-10 py-3 border-b border-n-3 shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)] 2xl:px-6 lg:-mt-18 lg:pr-20 md:pl-5 md:pr-18 dark:border-n-5 dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]">
        <div className="mr-auto h5 truncate md:h6">{title}</div>
        <div className="flex items-center ml-6 gap-3">
          <button
            className="group w-8 h-8 md:hidden"
            onClick={() => setFavorite(!favorite)}
          >
            <Icon
              className={`${
                favorite
                  ? "fill-accent-5"
                  : "fill-n-4 transition-colors group-hover:fill-accent-5"
              }`}
              name={favorite ? "star-fill" : "star"}
            />
          </button>
          {onToggleRightSidebar && (
            <>
              <Notifications
                items={notifications}
                className="md:hidden flex justify-center items-center w-10 h-10 rounded-full"
              />
              <button
                className="group w-8 h-8 md:hidden"
                onClick={onToggleRightSidebar}
                title={hideRightSidebar ? "Show sidebar" : "Hide sidebar"}
              >
                <Icon
                  className="fill-n-4 transition-colors group-hover:fill-primary-1"
                  name="clock"
                />
              </button>
            </>
          )}
          <Actions chatId={chatId} chatListIds={chatListIds} />
        </div>
      </div>
      <div className="relative z-2 grow p-10 space-y-10 overflow-y-auto scroll-smooth scrollbar-none 2xl:p-6 md:p-5">
        {children}
      </div>
      <ModalShareChat
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </>
  );
};

export default Chat;
