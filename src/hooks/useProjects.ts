import useSWR from "swr";

import { IProjects } from "@/types/projects/IProjects";
import { fetcher } from "@/utils/api/api";

interface Props {
  page?: number;
  countryId: string[];
  currencyId: string[];
  searchQuery: string;
}

export const useProjects = ({ page, countryId, currencyId, searchQuery }: Props) => {
  const pathKey = `/project?page=${page}${countryId.length > 0 ? `&country_id=${countryId.join(",")}` : ""}${currencyId.length > 0 ? `${`&currency_id=${currencyId.join(",")}`}` : ""}${searchQuery ? `&searchQuery=${searchQuery}` : ""}`;

  const { data, error, isLoading } = useSWR<IProjects>(pathKey, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  return {
    data: (data as IProjects) || ({ pagination: { totalRows: 1 } } as IProjects),
    loading: isLoading,
    error
  };
};
