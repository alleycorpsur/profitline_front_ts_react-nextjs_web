"use client";
import React, { useState, useEffect } from "react";
import { Flex, Tabs, Spin } from "antd";
import { Check, Eye, X } from "phosphor-react";

import { useAppStore } from "@/lib/store/store";
import { useModalDetail } from "@/context/ModalContext";
import { useNotificationOpen } from "@/hooks/useNotificationOpen";
import { useRejectedNotifications } from "@/hooks/useNotificationReject";
import UiSearchInput from "@/components/ui/search-input/search-input";
import FiltersNotifications, {
  ISelectFilterNotifications
} from "@/components/atoms/Filters/FiltersNotifications/FiltersNotifications";

import "./notificationsView.scss";

const ListPanel = [
  { key: "opened", value: "Abiertas" },
  { key: "closed", value: "Cerradas" }
];

interface Notification {
  create_at: string;
  notification_type_name: string;
  client_name: string;
  incident_id: number | null;
  is_client_change: number;
  client_update_changes: Record<string, any>;
  days: string;
}

export const NotificationsView = () => {
  const { openModal, modalType } = useModalDetail();
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [filters, setFilters] = useState<ISelectFilterNotifications>({
    lines: [],
    sublines: [],
    notificationTypes: []
  });

  const {
    data: openNotifications,
    isLoading: isLoadingOpen,
    isError: isErrorOpen,
    mutate: mutateOpen
  } = useNotificationOpen(projectId);
  const {
    data: closedNotifications,
    isLoading: isLoadingClosed,
    isError: isErrorClosed,
    mutate: mutateClosed
  } = useRejectedNotifications(projectId);
  const [filteredOpenNotifications, setFilteredOpenNotifications] = useState<Notification[]>([]);
  const [filteredClosedNotifications, setFilteredClosedNotifications] = useState<Notification[]>(
    []
  );

  useEffect(() => {
    if (openNotifications) setFilteredOpenNotifications(openNotifications);
    if (closedNotifications) setFilteredClosedNotifications(closedNotifications);
  }, [openNotifications, closedNotifications]);

  const handleSearch = (searchTerm: string) => {
    if (openNotifications) {
      setFilteredOpenNotifications(
        openNotifications.filter(
          (notification) =>
            notification.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.notification_type_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (closedNotifications) {
      setFilteredClosedNotifications(
        closedNotifications.filter(
          (notification) =>
            notification.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.notification_type_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };
  useEffect(() => {
    if (modalType === null) {
      mutateClosed();
      mutateOpen();
    }
  }, [modalType]);

  const renderNotifications = (type: "opened" | "closed") => {
    const currentNotifications =
      type === "opened" ? filteredOpenNotifications : filteredClosedNotifications;
    const isLoading = type === "opened" ? isLoadingOpen : isLoadingClosed;
    const isError = type === "opened" ? isErrorOpen : isErrorClosed;

    if (isLoading) return <Spin size="large" />;
    if (isError) return <div>Error al cargar las notificaciones</div>;

    return currentNotifications.map((item, index) => (
      <Flex className="notifications__container" key={index}>
        <div className="notifications__list">
          <div className="list-item">
            <div>
              <Flex gap="1rem">
                <p className="item__title">
                  {item.notification_type_name} - {item.incident_id}
                </p>
                <p className="item__name">{item.client_name}</p>
                <p className="item__date">{item.days}</p>
              </Flex>
              <p className="item__description">
                {item.is_client_change === 1 ? "Cambios en el cliente" : "Novedad"}
              </p>
            </div>
            <Flex gap="1rem">
              {/* {type === "closed" && (
                <>
                  <div className="label__status">
                    <Check size={14} />
                    Aprobar
                  </div>
                  <div className="label__status">
                    <X size={14} />
                    Rechazar
                  </div>
                </>
              )} */}
              <div
                className="eyeIcon"
                onClick={() => {
                  if (item.notification_type_name === "Novedad") {
                    openModal("novelty", { noveltyId: item.incident_id ?? 0 });
                  }
                }}
              >
                <Eye size={28} />
              </div>
            </Flex>
          </div>
        </div>
      </Flex>
    ));
  };

  return (
    <div className="notificationView">
      <Tabs
        defaultActiveKey="0"
        style={{ width: "100%", height: "100%" }}
        items={ListPanel.map((item, i) => {
          return {
            label: `${item.value} (${item.key === "opened" ? filteredOpenNotifications.length : filteredClosedNotifications.length})`,
            key: String(i),
            children: (
              <Flex vertical>
                <Flex className="searchBar__container">
                  <UiSearchInput
                    placeholder="Buscar"
                    onChange={(event) => {
                      setTimeout(() => {
                        handleSearch(event.target.value);
                      }, 300);
                    }}
                  />
                  <FiltersNotifications setSelectedFilters={setFilters} />
                </Flex>
                {renderNotifications(item.key as "opened" | "closed")}
              </Flex>
            )
          };
        })}
      />
    </div>
  );
};
