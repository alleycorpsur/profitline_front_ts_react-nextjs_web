"use client";
import { useState } from "react";
import { Button, Flex } from "antd";

import { ArrowLineRight, BellSimpleRinging, Gear, Megaphone, User, UsersThree, Truck } from "phosphor-react";
import Image from "next/image";

import "./sidebar.scss";
import { usePathname, useRouter } from "next/navigation";
import { logOut } from "../../../../firebase-utils";
import Link from "next/link";
import { useAppStore } from "@/lib/store/store";
import useStore from "@/lib/hook/useStore";
import config from "@/config";

const { isLogistics } = config;

export const SideBar = () => {
  const [isSideBarLarge, setIsSideBarLarge] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const project = useStore(useAppStore, (state) => state.selectProject);
  const LOGO = project?.LOGO;

  return (
    <div className={isSideBarLarge ? "mainLarge" : "main"}>
      <Flex vertical className="containerButtons">
        {LOGO && (
          <Flex className="logoContainer">
            <Image
              width={isSideBarLarge ? 75 : 50}
              height={isSideBarLarge ? 75 : 50}
              alt="logo company"
              src={LOGO.trim()}
            />
          </Flex>
        )}

        {!isLogistics && (
        <Link href="/clientes/all">
          <Button
            type="primary"
            size="large"
            icon={<User size={26} />}
            className={path.startsWith("/clientes") ? "buttonIcon" : "buttonIconActive"}
          >
            {isSideBarLarge && "Clientes"}
          </Button>
        </Link>
        )}
        {!isLogistics && (
        <Link href="/descuentos" passHref legacyBehavior>
          <Button
            type="primary"
            size="large"
            icon={<BellSimpleRinging size={26} />}
            className={path.startsWith("/descuentos") ? "buttonIcon" : "buttonIconActive"}
          >
            {isSideBarLarge && "Descuentos"}
          </Button>
        </Link>
        )}
        {!isLogistics && (
        <><Link href="/notificaciones" passHref legacyBehavior>
            <Button
              type="primary"
              size="large"
              icon={<BellSimpleRinging size={26} />}
              className={path.startsWith("/notificaciones") ? "buttonIcon" : "buttonIconActive"}
            >
              {isSideBarLarge && "Notificaciones"}
            </Button>
          </Link><Link href="/comercio" passHref legacyBehavior>
              <Button
                type="primary"
                size="large"
                icon={<Megaphone size={26} />}
                className={path.startsWith("/comercio") ? "buttonIcon" : "buttonIconActive"}
              >
                {isSideBarLarge && "Descuentos"}
              </Button>
            </Link><Link href="/comercio" passHref legacyBehavior>
              <Button
                type="primary"
                size="large"
                icon={<Megaphone size={26} />}
                className={path.startsWith("/comercio") ? "buttonIcon" : "buttonIconActive"}
              >
                {isSideBarLarge && "Descuentos"}
              </Button>
            </Link></>
        )}
        <Link href="/logistics/orders" passHref legacyBehavior>
          <Button
            type="primary"
            size="large"
            icon={<Truck size={26} />}
            className={path.startsWith("/logistics/orders") ? "buttonIcon" : "buttonIconActive"}
          >
            {isSideBarLarge && "Solicitudes"}
          </Button>
        </Link>
        <Link href="/logistics/providers/all" passHref legacyBehavior>
          <Button
            type="primary"
            size="large"
            icon={<UsersThree size={26} />}
            className={path.startsWith("/logistics/providers") ? "buttonIcon" : "buttonIconActive"}
          >
            {isSideBarLarge && "Clientes"}
          </Button>
        </Link>
        {!isLogistics && (
        <Link href="/" passHref legacyBehavior>
          <Button
            type="primary"
            size="large"
            icon={<Gear size={26} />}
            className={path.startsWith("/clientes") ? "buttonIcon" : "buttonIconActive"}
          >
            {isSideBarLarge && "Clientes"}
          </Button>
        </Link>
        )}

        <Link href="/logistics/configuration" passHref legacyBehavior>
          <Button
            type="primary"
            size="large"
            icon={<Gear size={26} />}
            className={path.startsWith("/logistics/configuration") ? "buttonIcon" : "buttonIconActive"}
          >
            {isSideBarLarge && "Ajustes"}
          </Button>
        </Link>
      </Flex>
      <Flex className="exit">
        <Button
          type="text"
          size="large"
          onClick={() => logOut(router)}
          icon={<ArrowLineRight size={26} />}
          className="buttonExit"
        >
          {isSideBarLarge && "Salir"}
        </Button>
      </Flex>
    </div>
  );
};
