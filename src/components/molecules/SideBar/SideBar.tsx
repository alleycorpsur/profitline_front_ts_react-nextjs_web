"use client";
import { useState } from "react";
import { Button, Flex } from "antd";

import { ArrowLineRight, User } from "phosphor-react";
import Image from "next/image";

import "./sidebar.scss";

export const SideBar = () => {
  const [isSideBarLarge, setIsSideBarLarge] = useState(false);
  return (
    <div className={isSideBarLarge ? "mainLarge" : "main"}>
      <Flex vertical justify="center" align="center" className="containerButtons">
        <Flex className="logoContainer">
          <Image
            width={isSideBarLarge ? 75 : 50}
            height={isSideBarLarge ? 75 : 50}
            alt="logo company"
            src="/images/cruz-verde.png"
          />
        </Flex>
        {/* <Button
          type="primary"
          size="large"
          icon={<SquaresFour size="26" />}
          className="buttonIconActive"
        >
          {isSideBarLarge && "Dashboard"}
        </Button> */}
        <Button type="primary" size="large" icon={<User size="26" />} className="buttonIcon">
          {isSideBarLarge && "Clientes"}
        </Button>
        {/* <Button type="primary" size="large" icon={<Gear size="26" />} className="buttonIconActive">
          {isSideBarLarge && "Administracion"}
        </Button> */}
      </Flex>
      <Flex>
        <Button
          type="text"
          size="large"
          onClick={() => setIsSideBarLarge(!isSideBarLarge)}
          icon={<ArrowLineRight size="26" />}
          className="buttonExit"
        >
          {isSideBarLarge && "Salir"}
        </Button>
      </Flex>
    </div>
  );
};
