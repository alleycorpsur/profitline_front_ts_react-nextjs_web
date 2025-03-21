import { Calendar, Hourglass } from "phosphor-react";
import ColumnText from "../../ColumnText/ColumnText";
import { Flex } from "antd";

export const ValiditySection: React.FC<{ validity: string; date: string | null }> = ({
  validity,
  date
}) => (
  <Flex vertical gap={16}>
    <ColumnText
      title="Vigencia"
      icon={<Hourglass size={16} color="#7B7B7B" />}
      content={validity || "-"}
    />
    <ColumnText title="Fecha" icon={<Calendar size={16} color="#7B7B7B" />} content={date || "-"} />
  </Flex>
);
