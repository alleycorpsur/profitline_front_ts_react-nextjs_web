import { Badge, List, Popover, Tabs, Spin, Flex } from "antd";
import React, { useState, useCallback } from "react";
import "./popoverUserNotifications.scss";
import Link from "next/link";
import { BellSimpleRinging, Envelope, Eye } from "phosphor-react";
import { timeAgo } from "@/utils/utils";
import TabPane from "antd/es/tabs/TabPane";
import { useModalDetail } from "@/context/ModalContext";
import { useNotificationStore } from "@/context/CountNotification";
import { markNotificationAsRead } from "@/services/notifications/notification";
import { useQuery, useQueryClient } from "react-query";
import { API } from "@/utils/api/api";

interface Notification {
  create_at: string;
  notification_type_name: string;
  client_name: string;
  incident_id: number;
  is_client_change: number;
  client_update_changes: Record<string, any>;
  days: string;
  id: number;
  is_read: number;
  id_erp: string;
}

interface PopoverUserNotificationsProps {
  setIsPopoverVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isPopoverVisible: boolean;
  projectId: number;
}

export const PopoverUserNotifications: React.FC<PopoverUserNotificationsProps> = ({
  setIsPopoverVisible,
  isPopoverVisible,
  projectId
}) => {
  const { notificationCount, updateNotificationCount } = useNotificationStore();
  const { openModal } = useModalDetail();
  const queryClient = useQueryClient();
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const fetchOpenNotifications = async (): Promise<Notification[]> => {
    const response = await API.get(`/notification/project/${projectId}/user`);
    return response.data;
  };

  const fetchRejectedNotifications = async (): Promise<Notification[]> => {
    const response = await API.get(`/notification/rejecteds/project/${projectId}/user`);

    return response.data;
  };

  const { data: openNotifications, isLoading: isLoadingOpen } = useQuery(
    ["openNotifications", projectId],
    fetchOpenNotifications,
    {
      enabled: shouldFetchData,
      staleTime: Infinity, // Prevent auto-refetching
      cacheTime: 0 // Don't cache the data
    }
  );

  const { data: rejectedNotifications, isLoading: isLoadingRejected } = useQuery(
    ["rejectedNotifications", projectId],
    fetchRejectedNotifications,
    {
      enabled: shouldFetchData,
      staleTime: Infinity, // Prevent auto-refetching
      cacheTime: 0 // Don't cache the data
    }
  );

  const handleVisibleChange = useCallback(
    async (visible: boolean) => {
      setIsPopoverVisible(visible);
      if (visible) {
        setShouldFetchData(true);
        updateNotificationCount();
        // Refetch notifications when popover opens
        queryClient.invalidateQueries(["openNotifications", projectId]);
        queryClient.invalidateQueries(["rejectedNotifications", projectId]);
        setTimeout(markNotificationsAsRead, 500);
      } else {
        setShouldFetchData(false);
      }
    },
    [setIsPopoverVisible, updateNotificationCount, queryClient, projectId]
  );

  const markNotificationsAsRead = async () => {
    const allNotifications = [...(openNotifications || []), ...(rejectedNotifications || [])];

    const markPromises = allNotifications.map((notification) =>
      markNotificationAsRead(notification.id)
        .then((response) => {
          if (response.data.status !== 200) {
            console.warn(
              `Failed to mark notification ${notification.id} as read:`,
              response.data.message
            );
          }
        })
        .catch((error) => {
          console.error(`Error marking notification ${notification.id} as read:`, error);
        })
    );

    await Promise.allSettled(markPromises);

    // Refresh the notification lists after marking as read
    queryClient.invalidateQueries(["openNotifications", projectId]);
    queryClient.invalidateQueries(["rejectedNotifications", projectId]);
  };

  const renderList = (data: Notification[] | undefined, isLoading: boolean) => {
    if (isLoading) return <Spin />;
    if (!data) return null;
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <Flex gap={"8px"} align="center">
                <p className="item__title">
                  {item.notification_type_name}
                  {item.id_erp && `-${item.id_erp}`}
                </p>
                {item.is_read === 0 ? (
                  <div className="item__read">
                    <Envelope size={11} />
                  </div>
                ) : null}
              </Flex>
              <p className="item__name">{item.client_name}</p>
              <p className="item__date">{item.days}</p>
            </div>
            <div
              className="eyeIcon"
              onClick={() => {
                if (item.notification_type_name === "Novedad") {
                  openModal("novelty", { noveltyId: item.incident_id });
                }
                handleVisibleChange(false);
              }}
            >
              <Eye size={28} />
            </div>
          </List.Item>
        )}
      />
    );
  };

  const content = (
    <div className="notificationsPopoverContent">
      <div className="modalTitle">
        <div className="title__text">
          <p>Notificaciones</p>
        </div>
        <div>
          <Link href="/notificaciones" passHref>
            Ver todo
          </Link>
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={`Abiertos ${openNotifications && openNotifications.length > 0 ? `(${openNotifications.length})` : ""}`}
          key="1"
        >
          {renderList(openNotifications, isLoadingOpen)}
        </TabPane>
        <TabPane
          tab={`Cerradas ${rejectedNotifications && rejectedNotifications.length > 0 ? `(${rejectedNotifications.length})` : ""}`}
          key="2"
        >
          {renderList(rejectedNotifications, isLoadingRejected)}
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      open={isPopoverVisible}
      onOpenChange={handleVisibleChange}
      placement="bottomLeft"
      overlayClassName="notificationsPopover"
      arrow={false}
    >
      <div className="notificationsWrapper">
        <div className={`notifications ${notificationCount > 0 ? "notifications_active" : ""}`}>
          {notificationCount > 0 ? (
            <Badge size="small" color="black" count={notificationCount}>
              <BellSimpleRinging size={18} />
            </Badge>
          ) : (
            <BellSimpleRinging size={18} />
          )}
        </div>
      </div>
    </Popover>
  );
};
