import useSWR from "swr";
import { fetcher } from "@/utils/api/api";

interface Props {
  idProject: string;
}

export const useShipTo = ({ idProject }: Props) => {
  const pathKey = `/ship-to/project/${idProject}`;
  const { data, error } = useSWR<any>(pathKey, fetcher, {});

  return {
    data: (data?.data as any[]) || ([] as any[]),
    loading: !error && !data
  };
};
