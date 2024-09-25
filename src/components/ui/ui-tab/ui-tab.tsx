import { FC, ReactNode } from "react";
import "./ui-tab.scss";
import { Tabs } from "antd";

interface ITab {
  key: string;
  label: string;
  children: ReactNode;
}

interface UiTabProps {
  tabs: ITab[];
  sticky?: boolean;
  tabBarExtraContent?: ReactNode;
  // eslint-disable-next-line no-unused-vars
  onChangeTab?: (activeKey: string) => void;
}

const UiTab: FC<UiTabProps> = ({
  tabs,
  tabBarExtraContent,
  onChangeTab,
  sticky = false
}: UiTabProps) => {
  return (
    <div className={`tabsContainer ${sticky && "-sticky"}`}>
      <Tabs
        style={{ width: "100%", height: "100%" }}
        defaultActiveKey="1"
        items={tabs}
        tabBarExtraContent={tabBarExtraContent}
        size="small"
        onChange={onChangeTab}
      />
    </div>
  );
};

export default UiTab;
