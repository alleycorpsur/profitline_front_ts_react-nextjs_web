"use client";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Poppins } from "@next/font/google";
import { ModalProvider } from "@/context/ModalContext";
import "../styles/globals.scss";
import { useEffect, useState } from "react";
import Loader from "@/components/atoms/loaders/loader";

import { QueryClient, QueryClientProvider } from "react-query";
import { MessageProvider } from "@/context/MessageContext";

const queryClient = new QueryClient();

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <html lang="es" className={poppins.className}>
        <QueryClientProvider client={queryClient}>
          <body>
            <AntdRegistry>
              {loading ? (
                <Loader />
              ) : (
                <MessageProvider>
                  <ModalProvider>{children}</ModalProvider>
                </MessageProvider>
              )}
            </AntdRegistry>
          </body>
        </QueryClientProvider>
      </html>
    </ConfigProvider>
  );
}
