import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

type FaqItemProps = {
    item: { title: string; content: string; defaultOpen?: boolean };
};

const FaqItem = ({ item }: FaqItemProps) => (
    <div className="border-t border-n-3 dark:border-n-6">
        <Collapsible defaultOpen={item.defaultOpen}>
            <CollapsibleTrigger className="flex w-full py-6 h6 transition-colors hover:text-primary-1 tap-highlight-color lg:hover:text-n-7 dark:lg:hover:text-n-1 group">
                <div className="relative shrink-0 w-8 h-8 mr-8 before:absolute before:top-1/2 before:left-1/2 before:w-4 before:h-0.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-n-6 before:rounded-full after:absolute after:top-1/2 after:left-1/2 after:w-0.5 after:h-4 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-n-6 after:rounded-full after:transition-transform after:group-data-[state=open]:rotate-90 md:mr-6 dark:before:bg-n-3 dark:after:bg-n-3" />
                <div className="text-left">{item.title}</div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="-mt-4 pl-16 pb-6 base1 text-n-4 md:pl-14 whitespace-pre-wrap">
                    {item.content}
                </div>
            </CollapsibleContent>
        </Collapsible>
    </div>
);

export default FaqItem;
