import { Divider, Flex, Image, Typography } from "antd";

import { LoginForm } from "../../forms/LoginForm/LoginForm";

import styles from "./login.module.scss";

export const LoginView = () => {
  const { Title } = Typography;

  return (
    <main className={styles.home}>
      <Flex align="center" className={styles.container}>
        <Flex className={styles.companySection}>
          <Title level={1} style={{ fontSize: "3.6rem", fontWeight: 500, color: "white" }}>
            Transport Management System
          </Title>
          <div className={styles.textCompanyContainer}>
            <Divider />
            <Title level={1} style={{ fontSize: "1.6rem", fontWeight: 500, color: "white" }}>
              The leading supply chain logistics platform
            </Title>
          </div>
        </Flex>
        <Flex className={styles.loginSection} align="center" justify="center">
          <Flex className={styles.login} vertical align="center" justify="space-between">
            <Title level={2} style={{ color: "white" }}>
              Bienvenido
            </Title>
            <LoginForm />
          </Flex>
        </Flex>
      </Flex>
    </main>
  );
};
