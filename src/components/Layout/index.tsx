import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { enablePageScroll, clearQueueScrollLocks } from "scroll-lock";
import { useMediaQuery } from "react-responsive";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Burger from "./Burger";

type LayoutProps = {
    smallSidebar?: boolean;
    hideRightSidebar?: boolean;
    backUrl?: string;
    children: React.ReactNode;
};

const Layout = ({
    smallSidebar = false,
    hideRightSidebar = false,
    backUrl,
    children,
}: LayoutProps) => {
    const [visibleSidebar, setVisibleSidebar] = useState<any>(
        true
    );
    const [visibleRightSidebar, setVisibleRightSidebar] =
        useState<boolean>(false);

    const isDesktop = useMediaQuery({
        query: "(max-width: 1179px)",
    });

    const handleClickOverlay = () => {
        setVisibleSidebar(false);
        setVisibleRightSidebar(false);
        clearQueueScrollLocks();
        enablePageScroll();
    };

    // useEffect(() => {
    //     setVisibleSidebar(false);
    // }, [isDesktop, smallSidebar]);

    return (
        <>
            <div
                className={`bg-n-7 md:p-0 md:bg-n-1 dark:md:bg-n-6 md:overflow-hidden ${
                    visibleSidebar
                        ? "pl-24 md:pl-0"
                        : smallSidebar
                        ? "pl-24 md:pl-0"
                        : "pl-80 xl:pl-24 md:pl-0"
                }`}
            >
                <LeftSidebar
                    value={visibleSidebar}
                    setValue={setVisibleSidebar}
                    visibleRightSidebar={visibleRightSidebar}
                    smallSidebar={smallSidebar}
                />
                <div
                    className={`flex md:py-0 ${
                        hideRightSidebar
                            ? "min-h-screen min-h-screen-ios"
                            : "h-screen h-screen-ios"
                    }`}
                >
                    <div
                        className={`relative flex grow max-w-full bg-n-1 md:rounded-none dark:bg-n-6 transition-[padding] ${
                            !hideRightSidebar &&
                            "pr-[22.5rem] 2xl:pr-80 lg:pr-0"
                        }`}
                    >
                        <div
                            className={`relative flex flex-col grow max-w-full ${
                                !hideRightSidebar && "md:pt-18"
                            }`}
                        >
                            {!hideRightSidebar && (
                                <Burger
                                    className={`
                                ${!visibleSidebar && "md:hidden"}
                            `}
                                    visibleRightSidebar={visibleRightSidebar}
                                    onClick={() =>
                                        setVisibleRightSidebar(
                                            !visibleRightSidebar
                                        )
                                    }
                                />
                            )}
                            {children}
                        </div>
                        {!hideRightSidebar && (
                            <RightSidebar
                                className={`
                                ${
                                    !visibleSidebar &&
                                    "md:translate-x-64 md:before:absolute md:before:z-30 md:before:inset-0"
                                }
                            `}
                                visible={visibleRightSidebar}
                            />
                        )}
                    </div>
                </div>
                <div
                    className={twMerge(
                        `fixed inset-0 z-10 bg-n-7/80 invisible opacity-0 md:hidden ${
                            (!visibleSidebar && smallSidebar) ||
                            (visibleRightSidebar && "visible opacity-100")
                        }`
                    )}
                    onClick={handleClickOverlay}
                ></div>
            </div>
        </>
    );
};

export default Layout;
