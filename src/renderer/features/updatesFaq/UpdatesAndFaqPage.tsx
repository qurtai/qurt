import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Icon } from "@/utils/icons";
import Faq from "./components/Faq";
import Updates from "./components/Updates";
import {
  updatesFaqService,
  type FaqItem,
  type UpdateItem,
} from "@/services/updates-faq-service";

const tabNavigation = ["Updates", "FAQ"];

const UpdatesAndFaqPage = () => {
  const navigate = useNavigate();
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [updateItems, setUpdateItems] = useState<UpdateItem[]>([]);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      const content = await updatesFaqService.getContent();
      if (!active) {
        return;
      }

      setFaqItems(content.faqItems);
      setUpdateItems(content.updateItems);
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout hideRightSidebar>
      <div className="p-20 2xl:px-10 md:pt-6 md:px-6 md:pb-10">
        <button
          className="hidden absolute top-6 right-6 w-10 h-10 border-2 border-n-4/25 rounded-full text-0 transition-colors hover:border-transparent hover:bg-n-4/25 md:block"
          onClick={() => navigate(-1)}
        >
          <Icon className="stroke-n-4" name="close" />
        </button>
        <div className="max-w-[58.5rem] mx-auto">
          <div className="mb-4 h2 md:pr-16 md:h3">Updates & FAQ</div>
          <div className="mb-12 body1 text-n-4 md:mb-6">
            Features, fixes & improvements.
          </div>
          <Tabs defaultValue="Updates" className="w-full">
            <TabsList className="mb-12 md:mb-6 h-auto p-0 bg-transparent gap-3">
              {tabNavigation.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="h-10 px-6 rounded-full base1 text-n-4 transition-colors outline-none tap-highlight-color hover:text-n-7 data-[state=active]:bg-primary-1 data-[state=active]:!text-n-1 dark:hover:text-n-1"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Updates">
              <Updates items={updateItems} />
            </TabsContent>
            <TabsContent value="FAQ">
              <Faq items={faqItems} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UpdatesAndFaqPage;
