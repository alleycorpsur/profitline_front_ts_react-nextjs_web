import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { Typography, Modal, Flex } from "antd";
import Link from "next/link";
const { Text } = Typography;

export default function redirectModal() {
  Modal.warning({
    title: "No tienes ningún proyecto seleccionado",
    content: <Text>Por favor, selecciona un proyecto para continuar.</Text>,
    onCancel: () => window.location.href = "/",
    footer: [
      <Flex gap={"1rem"} justify="end" wrap="wrap" key="1">
        <Link href="/">
          <PrincipalButton>Ir a proyectos</PrincipalButton>
        </Link>
      </Flex>
    ]
  });
}
