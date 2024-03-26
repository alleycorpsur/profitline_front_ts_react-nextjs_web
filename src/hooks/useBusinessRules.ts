import useSWR from "swr";
import { fetcher } from "@/utils/api/api";
import { useAppStore } from "@/lib/store/store";
import { IBRE } from "@/types/bre/IBRE";
import { MessageInstance } from "antd/es/message/interface";
import {
  addChannelBR,
  addLineBR,
  addSublineBR,
  removeChannelBR,
  removeLineBR,
  removeSublineBR
} from "@/services/businessRules/BR";

export const useStructureBR = () => {
  const { ID } = useAppStore((state) => state.selectProject);
  const { data, isLoading, mutate } = useSWR<IBRE>(`/bussines-rule/project/${ID}`, fetcher, {});

  const addChannel = async (channelDescription: string, messageApi: MessageInstance) => {
    await addChannelBR(ID, channelDescription, messageApi);
    mutate();
  };
  const removeChannel = async (channel_id: string, messageApi: MessageInstance) => {
    await removeChannelBR(ID, channel_id, messageApi);
    mutate();
  };
  const addLine = async (
    idChannel: string,
    lineDescription: string,
    messageApi: MessageInstance
  ) => {
    await addLineBR(idChannel, lineDescription, messageApi);
    mutate();
  };
  const removeLine = async (channel_id: number, line_id: number, messageApi: MessageInstance) => {
    await removeLineBR(channel_id, line_id, messageApi);
    mutate();
  };
  const addSubline = async (
    idLine: string,
    sublineDescription: string,
    messageApi: MessageInstance
  ) => {
    await addSublineBR(idLine, sublineDescription, messageApi);
    mutate();
  };
  const removeSubline = async (
    channel_id: number,
    line_id: number,
    messageApi: MessageInstance
  ) => {
    await removeSublineBR(channel_id, line_id, messageApi);
    mutate();
  };
  return {
    data,
    isLoading,
    addChannel,
    addLine,
    addSubline,
    removeChannel,
    removeLine,
    removeSubline
  };
};
