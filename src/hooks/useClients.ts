import useSWR from "swr";

import { fetcher } from "@/utils/api/api";
import { IClient, IClients } from "@/types/clients/IClients";

interface Props {
  // page?: number;
  idProject: number;
  // rolesId: string[];
  // zonesId: string[];
  // activeUsers: "all" | "active" | "inactive";
  // channel: { id: number; name: string }[];
  // line: { id: number; name: string }[];
  // subline: { id: number; name: string }[];
}

export const useClients = ({
  // page,
  idProject
  // zonesId,
  // rolesId,
  // activeUsers,
  // channel,
  // line,
  // subline
}: Props) => {
  // const zonesQuery = zonesId.length > 0 ? `&zone=${zonesId.join(",")}` : "";
  // const rolesQuery = rolesId.length > 0 ? `&rol=${rolesId.join(",")}` : "";
  // const statusQuery =
  //   activeUsers === "active" || activeUsers === "inactive"
  //     ? `&active=${activeUsers === "active" ? 1 : 0}`
  //     : "";

  // const channelQuery = channel.length > 0 ? `&chanel=${channel.join(",")}` : "";
  // const lineQuery = line.length > 0 ? `&line=${line.join(",")}` : "";
  // const sublineQuery = subline.length > 0 ? `&subline=${subline.join(",")}` : "";

  const pathKey = `/client/project/${idProject}`;
  const { data, error } = useSWR<IClients>(pathKey, fetcher, {});
  console.log(data);

  return {
    data: (data?.data as IClient[]) || ([] as IClient[]),
    loading: !error && !data
  };
};
