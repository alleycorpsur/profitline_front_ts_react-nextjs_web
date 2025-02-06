import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Upload,
  Dropdown,
  Menu,
  Flex,
  Tag,
  AutoComplete,
  Select
} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  PaperClipOutlined,
  DownOutlined
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import type { UploadProps } from "antd";
import styles from "./EmailModal.module.scss";
import { ArrowsInSimple, ArrowsOutSimple, Minus, X } from "phosphor-react";
import { set } from "react-hook-form";

interface SendEmailModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (emailData: EmailData) => void;
}

interface EmailData {
  to: string;
  cc?: string;
  subject: string;
  body: string;
  attachments: File[];
}
const emailSuggestions = [
  "usuario1@example.com",
  "usuario2@example.com",
  "usuario3@example.com",
  "usuario4@example.com"
];

const SendEmailModal: React.FC<SendEmailModalProps> = ({ visible, onClose, onSend }) => {
  const [modalSize, setModalSize] = useState({ width: 660, height: 520 });
  const [mask, setMask] = useState(false);
  type ViewMode = "default" | "minimized" | "maximized";
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  const handleMaximize = () => {
    setViewMode("maximized");
    setModalSize({ width: 940, height: 520 });
    setMask(true);
  };

  const handleRestore = () => {
    setViewMode("default");
    setModalSize({ width: 660, height: 520 });
    setMask(false);
  };

  const handleMinimize = () => {
    setViewMode("minimized");
    setMask(false);
  };

  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    cc: "",
    subject: "",
    body: "",
    attachments: []
  });
  const [format, setFormat] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: string;
  }>({
    bold: false,
    italic: false,
    underline: false,
    align: "left"
  });
  const [recipients, setRecipients] = useState<string[]>([]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [ccInputValue, setCcInputValue] = useState("");

  const handleFormatChange = (type: "bold" | "italic" | "underline") => {
    setFormat((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleAlignChange = (align: "left" | "center" | "right") => {
    setFormat((prev) => ({ ...prev, align }));
  };

  const handleFileChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      setEmailData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, info.file.originFileObj as File]
      }));
    }
  };

  const templateMenu = (
    <Menu style={{ backgroundColor: "white" }}>
      <Menu.Item
        onClick={() =>
          setEmailData((prev) => ({ ...prev, body: "Plantilla 1 - Texto predeterminado" }))
        }
      >
        Estado de cuenta
      </Menu.Item>
      <Menu.Item
        onClick={() => setEmailData((prev) => ({ ...prev, body: "Plantilla 2 - Otro texto" }))}
      >
        Envío de cuenta
      </Menu.Item>
      <Menu.Item
        onClick={() => setEmailData((prev) => ({ ...prev, body: "Plantilla 2 - Otro texto" }))}
      >
        Envío de de acuerdo de pago
      </Menu.Item>
      <Menu.Item
        onClick={() => setEmailData((prev) => ({ ...prev, body: "Plantilla 2 - Otro texto" }))}
      >
        Cobro prejuridico
      </Menu.Item>
      <Menu.Item
        onClick={() => setEmailData((prev) => ({ ...prev, body: "Plantilla 2 - Otro texto" }))}
      >
        Cobro juridico
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    if (visible) {
      setViewMode("default");
      setModalSize({ width: 660, height: 520 });
      setMask(false);
    }
  }, [visible]);

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <span>Correo electrónico</span>
          <Flex gap={8}>
            {viewMode !== "minimized" && (
              <Button
                type="text"
                icon={<Minus color="#ffffff" size={20} />}
                onClick={handleMinimize}
              />
            )}
            {viewMode !== "maximized" && (
              <Button
                type="text"
                icon={<ArrowsOutSimple color="#ffffff" size={20} />}
                onClick={handleMaximize}
              />
            )}
            {viewMode !== "default" && (
              <Button
                type="text"
                icon={<ArrowsInSimple color="#ffffff" size={20} />}
                onClick={handleRestore}
              />
            )}

            <Button type="text" icon={<X color="#ffffff" size={20} />} onClick={onClose} />
          </Flex>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={false}
      mask={mask}
      style={{
        position: "fixed",
        bottom: viewMode === "maximized" ? "auto" : 0,
        left: "50%",
        transform: "translateX(-50%)",
        transition: "all 0.3s ease-in-out"
      }}
      height={modalSize.height}
      width={modalSize.width}
    >
      {viewMode !== "minimized" && (
        <Flex vertical gap={20} className={styles.container}>
          <Flex gap={16}>
            <span
              style={{
                padding: "10px 12px",
                backgroundColor: "#F7F7F7",
                color: "#141414",
                fontSize: "16px",
                fontWeight: 300
              }}
            >
              Para
            </span>
            <Select
              mode="multiple"
              value={recipients}
              onChange={setRecipients}
              options={emailSuggestions.map((email) => ({ value: email, label: email }))}
              className={styles.select}
              style={{ border: "none", borderBottom: "1px solid #D9D9D9" }}
            />
          </Flex>
          <Flex gap={16}>
            <span
              style={{
                padding: "10px 12px",
                backgroundColor: "#F7F7F7",
                color: "#141414",
                fontSize: "16px",
                fontWeight: 300,
                textAlign: "left"
              }}
            >
              CC
            </span>
            <Select
              mode="multiple"
              value={ccRecipients}
              onChange={setCcRecipients}
              options={emailSuggestions.map((email) => ({ value: email, label: email }))}
              className={styles.select}
            />
          </Flex>

          <Input
            placeholder="Ingresar asunto"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            className={styles.textArea}
            style={{
              backgroundColor: "#F7F7F7",
              color: "#141414",
              fontSize: "16px",
              fontWeight: 300,
              border: "none"
            }}
          />
          <TextArea
            placeholder="Cuerpo"
            value={emailData.body}
            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
            style={{
              fontWeight: format.bold ? "bold" : "normal",
              fontStyle: format.italic ? "italic" : "normal",
              textDecoration: format.underline ? "underline" : "none",
              textAlign: format.align as "left" | "center" | "right",
              backgroundColor: "#F7F7F7",
              color: "#141414",
              fontSize: "16px",
              border: "none"
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }} className={styles.toolbar}>
            <Button
              type={format.bold ? "primary" : "default"}
              icon={<BoldOutlined />}
              onClick={() => handleFormatChange("bold")}
            />
            <Button
              type={format.italic ? "primary" : "default"}
              icon={<ItalicOutlined />}
              onClick={() => handleFormatChange("italic")}
            />
            <Button
              type={format.underline ? "primary" : "default"}
              icon={<UnderlineOutlined />}
              onClick={() => handleFormatChange("underline")}
            />
            <Button
              type={format.align === "left" ? "primary" : "default"}
              icon={<AlignLeftOutlined />}
              onClick={() => handleAlignChange("left")}
            />
            <Button
              type={format.align === "center" ? "primary" : "default"}
              icon={<AlignCenterOutlined />}
              onClick={() => handleAlignChange("center")}
            />
            <Button
              type={format.align === "right" ? "primary" : "default"}
              icon={<AlignRightOutlined />}
              onClick={() => handleAlignChange("right")}
            />
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleFileChange}>
              <Button icon={<PaperClipOutlined />} />
            </Upload>
            <Dropdown overlay={templateMenu} className={styles.select}>
              <Button>
                Seleccionar plantilla <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <Button
            type="primary"
            block
            style={{ marginTop: 10 }}
            onClick={() => onSend(emailData)}
            className={styles.sendButton}
            disabled={!emailData.to || !emailData.subject || !emailData.body}
          >
            Enviar
          </Button>
        </Flex>
      )}
    </Modal>
  );
};

export default SendEmailModal;
