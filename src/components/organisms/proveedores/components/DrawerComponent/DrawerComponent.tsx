// DrawerComponent.tsx
import React, { useEffect, useState } from "react";
import { Drawer, Flex, Typography } from "antd";
import DescriptionSection from "./sections/DescriptionSection";
import ApproversSection from "./sections/ApproversSection";
import DocumentSection from "./sections/DocumentSection";
import ExpirationSection from "./sections/ExpirationSection";
import EventsSection from "./sections/EventsSection";
import { ValiditySection } from "./sections/ValiditySection";
import { CaretDoubleRight } from "phosphor-react";
import { Tag } from "@/components/atoms/Tag/Tag";
import IconButton from "@/components/atoms/IconButton/IconButton";
import { getTagColor } from "../../utils/utils";
import { IRequirement } from "../../interfaces/FormData";

const { Title } = Typography;

interface DrawerProps {
  requirementIndex: number;
  clientTypeId: number;
  visible: boolean;
  onClose: () => void;
  requirement?: IRequirement;
  updateExpirationDate: (expirationDate: string) => void;
  control: any;
  errors: any;
}

const DrawerComponent: React.FC<DrawerProps> = ({
  requirementIndex,
  clientTypeId,
  visible,
  onClose,
  requirement,
  control,
  errors,
  updateExpirationDate
}) => {
  console.log("requirement", requirement);

  const [localRequirement, setLocalRequirement] = useState<IRequirement | undefined>(requirement);

  useEffect(() => {
    setLocalRequirement(requirement);
  }, [requirement]);

  const tagColor = getTagColor(requirement?.status ?? "");

  if (!localRequirement) {
    return null; // Si no hay requerimiento seleccionado, no se muestra nada
  }

  return (
    <Drawer
      title={
        <Flex vertical justify="flex-start">
          <IconButton icon={<CaretDoubleRight size={20} />} onClick={onClose} />
          <Title style={{ marginTop: 20 }} level={4}>
            {requirement?.name}
          </Title>
          <Flex wrap>
            <Tag
              content={requirement?.status ?? ""}
              color={tagColor}
              style={{
                fontWeight: 400,
                fontSize: 14
              }}
            />
          </Flex>
          <hr style={{ borderTop: "1px solid #f7f7f7", marginTop: 20 }} />
        </Flex>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={644}
      closeIcon={false}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <Flex gap={16} vertical>
        <DescriptionSection
          description={requirement?.description ?? ""}
          uploadedBy={requirement?.loadedBy ?? ""}
        />
        <ValiditySection
          validity={requirement?.expiryDate ?? ""}
          date={requirement?.createdAt ?? ""}
        />
        <ApproversSection approvers={requirement?.approvers ?? []} />
        <hr style={{ borderTop: "1px solid #f7f7f7" }} />
        <DocumentSection
          control={control}
          templateUrl={requirement?.template}
          name={`requirements.${requirementIndex}.files`}
        />
        <ExpirationSection
          control={control}
          name={`requirements[${requirementIndex}].expirationDate`}
        />
        <EventsSection events={requirement?.events ?? []} onAddComment={() => {}} />
      </Flex>
    </Drawer>
  );
};

export default DrawerComponent;
