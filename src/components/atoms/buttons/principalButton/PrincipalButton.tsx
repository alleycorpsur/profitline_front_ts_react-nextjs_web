import { Button, ConfigProvider, theme } from "antd";
import { BaseButtonProps } from "antd/es/button/button";

const { useToken } = theme;

export default function PrincipalButton({ children, ...rest }: BaseButtonProps) {
  const { token } = useToken();
  const color = token.green;
  console.log(color);

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: color,
            colorPrimaryHover: color,
            colorPrimaryActive: color,
            primaryShadow: "none",
            paddingContentHorizontal: 24,
            paddingContentVertical: 12,
          }
        }
      }}
    >
      <Button type="primary" size="large" {...rest}>
        {children}
      </Button>
    </ConfigProvider>
  );
}
