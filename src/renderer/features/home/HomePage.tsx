import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Main from "./Main";

const HomePage = () => {
  const [hideRightSidebar, setHideRightSidebar] = useState(true);
  const location = useLocation();
  const listParam = new URLSearchParams(location.search).get("list")?.trim() || "";
  const prevListParamRef = useRef("");

  useEffect(() => {
    if (listParam && prevListParamRef.current !== listParam) {
      prevListParamRef.current = listParam;
      setHideRightSidebar(false);
    } else if (!listParam) {
      prevListParamRef.current = "";
    }
  }, [listParam]);

  return (
    <Layout
      hideRightSidebar={hideRightSidebar}
      onToggleRightSidebar={() => setHideRightSidebar((prev) => !prev)}
      openRightSidebarTrigger={listParam || undefined}
    >
      <Main />
    </Layout>
  );
};

export default HomePage;
