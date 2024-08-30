import { Flex, Typography } from "antd";

// components
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";

//import "../../../../../../../../styles/_variables_logistics.css";

import "./createGeneralView.scss";
import { MaterialsTable } from "@/components/molecules/tables/logistics/materialsTable/materialsTable";

const { Title } = Typography;

export const CreateGeneralView = () => {
  return (
    <><MaterialsTable/></>
  );
};