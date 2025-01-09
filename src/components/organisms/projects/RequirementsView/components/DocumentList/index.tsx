import React, { useState } from "react";
import { Modal, Table, Checkbox, Button, Typography, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileArrowDown, Plus } from "phosphor-react";
import Link from "next/link";
import { FooterButtons } from "@/components/molecules/FooterButtons/FooterButtons";
const { Title, Text } = Typography;

interface Document {
  key: string;
  documentName: string;
  validity: string;
  template: string | null;
}

interface Form {
  key: string;
  formName: string;
  validity: string;
  questions_quantity: number;
}
const mockedDocuments: Document[] = [
  { key: "1", documentName: "RUT", validity: "30 días", template: "si" },
  { key: "2", documentName: "Referencia comercial", validity: "1 año", template: null },
  { key: "3", documentName: "Cédula representante legal", validity: "-", template: null },
  { key: "4", documentName: "Certificado de antecedentes", validity: "2 años", template: null }
];
const mockedForms: Form[] = [
  { key: "1", formName: "Formulario de Registro", validity: "30 días", questions_quantity: 10 },
  { key: "2", formName: "Encuesta de Satisfacción", validity: "1 año", questions_quantity: 5 },
  { key: "3", formName: "Formato de Evaluación", validity: "Sin límite", questions_quantity: 20 }
];

interface Props {
  onClose: () => void;
  selectedClientType: number | null;
  listType: "documents" | "forms";
  addNewDocument: () => void;
}

const DocumentList = ({ onClose, selectedClientType, listType, addNewDocument }: Props) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // const columns: ColumnsType<Document> = [
  //   {
  //     title: "Documento",
  //     dataIndex: "documentName",
  //     key: "documentName",
  //     render: (text, record) => (
  //       <Checkbox
  //         checked={selectedRows.includes(record.key)}
  //         onChange={(e) => handleCheckboxChange(record.key, e.target.checked)}
  //       >
  //         {text}
  //       </Checkbox>
  //     )
  //   },
  //   {
  //     title: "Vigencia",
  //     dataIndex: "validity",
  //     key: "validity"
  //   },
  //   {
  //     title: "Plantilla",
  //     dataIndex: "template",
  //     key: "template",
  //     render: (template: string) => {
  //       if (template?.length > 0) {
  //         return (
  //           <Link
  //             style={{
  //               display: "flex",
  //               alignItems: "center",
  //               gap: "4px",
  //               textDecoration: "underline"
  //             }}
  //             href={`/requisitos/plantilla/${template}`}
  //           >
  //             Documento <FileArrowDown size={16} />
  //           </Link>
  //         );
  //       } else return <Text>-</Text>;
  //     }
  //   }
  // ];
  const documentColumns: ColumnsType<Document> = [
    {
      title: "Documento",
      dataIndex: "documentName",
      key: "documentName",
      render: (text, record) => (
        <Checkbox
          checked={selectedRows.includes(record.key)}
          onChange={(e) => handleCheckboxChange(record.key, e.target.checked)}
        >
          {text}
        </Checkbox>
      )
    },
    {
      title: "Vigencia",
      dataIndex: "validity",
      key: "validity"
    },
    {
      title: "Plantilla",
      dataIndex: "template",
      key: "template",
      render: (template: string) =>
        template ? (
          <Link
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "underline"
            }}
            href={`/requisitos/plantilla/${template}`}
          >
            Documento <FileArrowDown size={16} />
          </Link>
        ) : (
          <Text>-</Text>
        )
    }
  ];
  const formColumns: ColumnsType<Form> = [
    {
      title: "Formulario",
      dataIndex: "formName",
      key: "formName",
      render: (text, record) => (
        <Checkbox
          checked={selectedRows.includes(record.key)}
          onChange={(e) => handleCheckboxChange(record.key, e.target.checked)}
        >
          {text}
        </Checkbox>
      )
    },
    {
      title: "Vigencia",
      dataIndex: "validity",
      key: "validity"
    },
    {
      title: "Preguntas",
      dataIndex: "questions_quantity",
      key: "questions_quantity"
    }
  ];
  const handleCheckboxChange = (key: string, isChecked: boolean) => {
    setSelectedRows((prev) =>
      isChecked ? [...prev, key] : prev.filter((rowKey) => rowKey !== key)
    );
  };
  const dataSource = listType === "documents" ? mockedDocuments : mockedForms;
  const columns = listType === "documents" ? documentColumns : formColumns;
  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  // const handleAddDocuments = () => {
  //   console.log("Agregar documentos seleccionados:", selectedRows);
  //   setIsModalVisible(false);
  // };

  return (
    <Flex vertical gap="1rem">
      <Table
        dataSource={dataSource as any}
        columns={columns as any}
        pagination={false}
        rowKey="key"
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={columns.length} index={0}>
              <Button
                type="primary"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: "black",
                  padding: "0",
                  fontWeight: "500"
                }}
                onClick={addNewDocument}
                icon={<Plus size={16} />}
              >
                {`Nuevo ${listType === "documents" ? "documento" : "formulario"}`}
              </Button>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <FooterButtons
        backTitle={"Cancelar"}
        nextTitle={`Agregar ${listType === "documents" ? "documentos" : ""}`}
        handleBack={onClose}
        handleNext={() => {}}
        nextDisabled={false}
        isSubmitting={false}
      />
    </Flex>
  );
};

export default DocumentList;
