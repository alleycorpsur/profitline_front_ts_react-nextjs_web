import React, { useState } from "react";
import { Table, Button, Flex, Dropdown, Menu, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Tag } from "@/components/atoms/Tag/Tag";
import {
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  SyncOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  FileDoneOutlined
} from "@ant-design/icons";
import { Circle, DotsThree, Users } from "phosphor-react";
import { ButtonGenerateAction } from "@/components/atoms/ButtonGenerateAction/ButtonGenerateAction";
import IconButton from "@/components/atoms/IconButton/IconButton";
import SendEmailModal from "@/components/molecules/modals/SendEmailModal";

export interface Task {
  key: string;
  client: string;
  taskType: string;
  description: string;
  status: "En curso" | "Completado" | "Sin empezar";
  responsible: string;
  portfolio: string;
  impact: string;
}
interface IMenuItem {
  key: string;
  icon: JSX.Element;
  title: string;
  onClick?: () => void;
}
const MenuItemCustom = ({ key, icon, title, onClick }: IMenuItem) => (
  <Menu.Item key={key} style={{ backgroundColor: "#F7F7F7" }} icon={icon} onClick={onClick}>
    {title}
  </Menu.Item>
);

const statusColors: Record<Task["status"], string> = {
  "En curso": "#0085FF",
  Completado: "#00DE16",
  "Sin empezar": "#DDDDDD"
};

const TaskTable: React.FC<{ data: Task[]; modalAction: () => void }> = ({ data, modalAction }) => {
  const menu = (
    <Menu
      style={{
        backgroundColor: "white",
        padding: 12,
        gap: 10,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <MenuItemCustom
        key="Enviar correo"
        icon={<MailOutlined size={12} />}
        title="Enviar correo"
        onClick={modalAction}
      />
      <MenuItemCustom key="Llamar" icon={<PhoneOutlined size={12} />} title="Llamar" />
      <MenuItemCustom key="WhatsApp" icon={<WhatsAppOutlined size={12} />} title="WhatsApp" />
      <MenuItemCustom key="Agendar visita" icon={<Users size={12} />} title="Agendar visita" />
      <MenuItemCustom key="Conciliar" icon={<CalendarOutlined size={12} />} title="Conciliar" />
      <MenuItemCustom
        key="Aplicar pago"
        icon={<CreditCardOutlined size={12} />}
        title="Aplicar pago"
      />
      <MenuItemCustom key="Radicar" icon={<FileTextOutlined size={12} />} title="Radicar" />
      <MenuItemCustom
        key="Reportar pago"
        icon={<FileDoneOutlined size={12} />}
        title="Reportar pago"
      />
    </Menu>
  );

  const columns: ColumnsType<Task> = [
    { title: "Cliente", dataIndex: "client", key: "client", fixed: "left", width: 180 },
    { title: "Tipo de tarea", dataIndex: "taskType", key: "taskType", width: 150 },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: Task["status"]) => (
        <Flex>
          <Tag
            icon={<Circle color={statusColors[status]} weight="fill" size={6} />}
            content={status}
            color={statusColors[status]}
            withBorder={false}
          />
        </Flex>
      )
    },
    { title: "Responsable", dataIndex: "responsible", key: "responsible", width: 120 },
    { title: "Cartera", dataIndex: "portfolio", key: "portfolio", width: 150 },
    { title: "Impacto", dataIndex: "impact", key: "impact", width: 150 },
    {
      title: "Acción",
      key: "action",
      fixed: "right",
      width: 100,
      render: () => (
        <Dropdown overlay={menu} trigger={["click"]}>
          <IconButton icon={<DotsThree size={20} />} />
        </Dropdown>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
      bordered
    />
  );
};

export default TaskTable;
