import { Icon } from "@/utils/icons";

type FeaturesProps = {
    items: any;
};

const Features = ({ items }: FeaturesProps) => (
    <div className="lg:hidden">
        <div className="flex mb-8 h4">
            <div className="w-[14.875rem] h4">Core features</div>
            <div className="hidden flex-1 px-8 2xl:block">Free</div>
            <div className="hidden flex-1 px-8 text-[#0F9F43] 2xl:block">
                Pro
            </div>
            <div className="hidden flex-1 px-8 text-[#3E90F0] 2xl:block">
                Enterprise
            </div>
        </div>
        <div className="">
            {items.map((item: any) => (
                <div
                    className="flex items-center py-5 border-t border-n-4/15"
                    key={item.id}
                >
                    <div className="w-[14.875rem] base2 font-semibold">
                        {item.title}
                    </div>
                    <div className="flex items-center flex-1 px-8">
                        <Icon
                            className={`${
                                item.free ? "stroke-primary-1" : "stroke-n-4"
                            }`}
                            name={item.free ? "check-thin" : "close"}
                        />
                    </div>
                    <div className="flex items-center flex-1 px-8">
                        <Icon
                            className={`${
                                item.pro ? "stroke-primary-1" : "stroke-n-4"
                            }`}
                            name={item.pro ? "check-thin" : "close"}
                        />
                        {item.id === "4" && (
                            <div className="ml-3 base2">Via email</div>
                        )}
                    </div>
                    <div className="flex items-center flex-1 px-8">
                        <Icon
                            className={`${
                                item.enterprise ? "stroke-primary-1" : "stroke-n-4"
                            }`}
                            name={item.enterprise ? "check-thin" : "close"}
                        />
                        {item.id === "4" && (
                            <div className="ml-3 base2">Chat 24/7</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Features;
