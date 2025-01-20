// sections/ApproversSection.tsx
import React from "react";
import { Flex } from "antd";
import { Info, UsersThree } from "phosphor-react";
import ColumnText from "../../ColumnText/ColumnText";
import { Tag } from "@/components/atoms/Tag/Tag";

interface ApproversSectionProps {
  approvers: string[]; // Lista de nombres de los aprobadores
}

const ApproversSection: React.FC<ApproversSectionProps> = ({ approvers }) => (
  <ColumnText
    title="Aprobadores"
    icon={<UsersThree size={16} color="#7B7B7B" />}
    content={
      <Flex align="center" gap={8} wrap>
        {approvers.map((approver, index) => (
          <Tag key={index} content={approver} icon={<Info size={16} />} iconPosition="left" />
        ))}
      </Flex>
    }
  />
);

export default ApproversSection;
