import useSWR from "swr";

import { useAppStore } from "@/lib/store/store";
import { IZones } from "@/types/zones/IZones";
import { fetcher } from "@/utils/api/api";
import { addZone, removeZoneById } from "@/services/zone/zones";
import { MessageInstance } from "antd/es/message/interface";

export const useZone = () => {
  const { ID } = useAppStore((state) => state.selectProject);

  const { data, isLoading, mutate } = useSWR<IZones>(`/zone/project/${ID}`, fetcher, {});

  const createZone = async (name: string, messageApi: MessageInstance) => {
    await addZone({ name: name, project_id: `${ID}`, messageApi });
    mutate();
  };

  const removeZone = async (id: string, messageApi: MessageInstance) => {
    await removeZoneById({ idZone: id, messageApi });
    mutate();
  };

  return {
    data,
    isLoading,
    createZone,
    removeZone
  };
};
