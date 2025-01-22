"use client";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Poppins, Roboto_Mono } from "next/font/google";
import { ModalProvider } from "@/context/ModalContext";
import "../styles/globals.scss";
import { useEffect, useState } from "react";
import Loader from "@/components/atoms/loaders/loader";

import { QueryClient, QueryClientProvider } from "react-query";
import { MessageProvider } from "@/context/MessageContext";

const queryClient = new QueryClient();

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins" // Define a CSS variable for Poppins
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Adjust weights as needed
  variable: "--font-roboto-mono" // Define a CSS variable for Roboto Mono
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
      <html lang="es" className={`${poppins.variable} ${robotoMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <body className={poppins.className}>
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
