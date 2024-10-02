import { useState } from "react";
import { Flex } from "antd";
import { LogoCashport } from "@/components/atoms/logoCashport/LogoCashport";
import { LoginForm } from "../../forms/LoginForm/LoginForm";
import { InfoCardLogin } from "@/components/molecules/login/InfoCardLogin/InfoCardLogin";
import { RestartPassword } from "@/components/molecules/login/RestarPassword/RestartPassword";
import { ContactUsButton } from "@/components/atoms/buttons/contactUsButton/ContactUsButton";

import styles from "./login.module.scss";

export const LoginView = () => {
  const [resetPassword, setResetPassword] = useState(false);
  console.log("entre");

  return (
    <main className={styles.container}>
      <InfoCardLogin />
      <Flex className={styles.loginSection} align="center" justify="center" vertical>
        <Flex className={styles.login} vertical align="center" justify="space-between">
          <div className={styles.login__title}>
            <LogoCashport width={370} />
          </div>
          {!resetPassword ? (
            <LoginForm setResetPassword={setResetPassword} />
          ) : (
            <RestartPassword setResetPassword={setResetPassword} />
          )}
          <ContactUsButton />
        </Flex>
      </Flex>
    </main>
  );
};
