import { Flex } from "antd";
import { SideBar } from "../../molecules/SideBar/SideBar";
import Header from "../header";
import styles from "./ViewWrapper.module.scss";

interface IViewWrapper {
  headerTitle: string;
  children: React.ReactNode;
}
export default function ViewWrapper({ headerTitle, children }: Readonly<IViewWrapper>) {
  return (
    <main className={styles.mainWrapper}>
      <SideBar />
      <Flex vertical className={styles.rightContent} gap={"1rem"}>
        <Header title={headerTitle} />
        {children}
      </Flex>
    </main>
  );
}
