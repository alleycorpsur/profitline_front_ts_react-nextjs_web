// DrawerComponent.tsx
import React from "react";
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
import { useDocument } from "@/hooks/useDocument";

const { Title } = Typography;

interface DrawerProps {
  subjectId: string;
  documentTypeId: string;
  visible: boolean;
  onClose: () => void;
  control: any;
  errors: any;
}

const DrawerComponent: React.FC<DrawerProps> = ({
  subjectId,
  documentTypeId,
  visible,
  onClose,
  control,
  errors
}) => {
  const { document, isLoading, mutate } = useDocument(subjectId, documentTypeId);

  if (isLoading || !document) {
    return null;
  }

  return (
    <Drawer
      title={
        <Flex vertical justify="flex-start">
          <IconButton icon={<CaretDoubleRight size={20} />} onClick={onClose} />
          <Title style={{ marginTop: 20 }} level={4}>
            {document.documentTypeName}
          </Title>
          <Flex wrap>
            <Tag
              content={document.statusName}
              color={document.statusColor}
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
          description={document.documentTypeDescription}
          uploadedBy={document.createdBy}
        />
        <ValiditySection validity={document.expiryDate} date={document.createdAt} />
        <ApproversSection approvers={document.approvers} />
        <hr style={{ borderTop: "1px solid #f7f7f7" }} />
        <DocumentSection
          documents={document.documents}
          templateUrl={document.templateUrl}
          subjectId={subjectId}
          documentTypeId={documentTypeId}
          mutate={mutate}
        />
        <ExpirationSection control={control} name="expirationDate" />
        <EventsSection events={[]} onAddComment={() => {}} />
      </Flex>
    </Drawer>
  );
};

export default DrawerComponent;
