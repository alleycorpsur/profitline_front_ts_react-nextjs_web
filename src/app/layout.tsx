import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Poppins } from "@next/font/google";
import esES from 'antd/locale/es_ES';

import "../styles/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ConfigProvider theme={theme} locale={esES}>
      <html lang="es" className={poppins.className}>
        <head>
          <link href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css" rel="stylesheet" />
        </head>
        <body>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
