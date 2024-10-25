import { create } from "zustand";
import { API } from "@/utils/api/api";

interface NotificationStore {
  notificationCount: number;
  updateNotificationCount: () => Promise<void>;
}

const getSelectedProjectId = (): number | null => {
  const projectData = sessionStorage.getItem("project");
  if (projectData) {
    try {
      const parsedData = JSON.parse(projectData);
      return parsedData.state.selectedProject.ID;
    } catch (error) {
      console.error("Error parsing project data from sessionStorage", error);
    }
  }
  return null;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notificationCount: 0,
  updateNotificationCount: async () => {
    const projectId = getSelectedProjectId();
    if (projectId !== null) {
      try {
        const response = await API.get(`/notification/count/project/${projectId}/user`);
        set({ notificationCount: response.data });
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    }
  }
}));
